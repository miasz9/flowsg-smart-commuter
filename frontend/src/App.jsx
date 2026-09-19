import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import './App.css';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock routes matching Singapore transit network (DataMall & OneMap)
const MOCK_ROUTES = [
  {
    id: 'dtl-alt',
    title: '⭐️ Alternative via DTL',
    time: '46 min',
    points: 20,
    crowding: 'Low crowding',
    crowdingLevel: 'green',
    delayRisk: 'Low delay risk',
    delayLevel: 'green',
    walkTime: '8 min walking',
    timeDelta: '4 min slower',
    reason: 'Avoids the affected route and has lower forecast crowding.',
    isRecommended: true,
    path: [[1.2966, 103.8501], [1.2930, 103.8520], [1.2840, 103.8510]],
  },
  {
    id: 'usual-ewl',
    title: 'Your usual route',
    time: '42 min',
    points: 0,
    crowding: 'High crowding',
    crowdingLevel: 'red',
    delayRisk: 'Disruption reported',
    delayLevel: 'red',
    walkTime: '5 min walking',
    timeDelta: 'Fastest direct path',
    reason: 'Subject to active signal delays along EWL.',
    isRecommended: false,
    path: [[1.2966, 103.8501], [1.2880, 103.8470], [1.2840, 103.8510]],
  },
  {
    id: 'bus-loop',
    title: 'Other route (Bus Transfer)',
    time: '51 min',
    points: 30,
    crowding: 'Moderate crowding',
    crowdingLevel: 'yellow',
    delayRisk: 'Low delay risk',
    delayLevel: 'green',
    walkTime: '12 min walking',
    timeDelta: '9 min slower',
    reason: 'Higher points awarded for taking off-peak bus loop.',
    isRecommended: false,
    path: [[1.2966, 103.8501], [1.3000, 103.8450], [1.2840, 103.8510]],
  },
];

// Sample turn-by-turn GPS instructions
const GPS_STEPS = [
  'In 100m, turn right onto College Link',
  'Board Bus 95 at NUS Raffles Hall stop',
  'Alight at Buona Vista Station Exit C',
  'Transfer to Downtown Line towards Expo',
  'You have arrived at your destination!',
];

export default function App() {
  // Navigation Screens: 'home' | 'me' | 'rewards' | 'route-detail' | 'gps'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');

  // User Settings & Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Hee Jin',
    language: 'English',
    darkMode: false,
    preferences: {
      fastest: true,
      leastCrowded: true,
      sheltered: false,
      accessible: false,
    },
  });

  // Rewards & Points State
  const [pointsBalance, setPointsBalance] = useState(1240);
  const [recentJourneys, setRecentJourneys] = useState([
    { id: 1, route: 'Kent Ridge → Downtown', points: 20, date: 'Today, 08:30 AM' },
  ]);

  // Route & Search Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(MOCK_ROUTES[0]);
  const [gpsStepIndex, setGpsStepIndex] = useState(0);

  // Apply dark mode CSS toggle dynamically
  useEffect(() => {
    if (userProfile.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [userProfile.darkMode]);

  // Handle Tab Navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    if (tab === 'me') setCurrentScreen('me');
    if (tab === 'rewards') setCurrentScreen('rewards');
    if (tab === 'directions') setCurrentScreen('home');
  };

  // Start Navigation Flow
  const handleSelectRouteDetail = (route) => {
    setSelectedRoute(route);
    setCurrentScreen('route-detail');
  };

  const handleStartGPS = () => {
    setGpsStepIndex(0);
    setCurrentScreen('gps');
  };

  const handleFinishJourney = () => {
    const earned = selectedRoute.points;
    setPointsBalance((prev) => prev + earned);
    setRecentJourneys((prev) => [
      { id: Date.now(), route: 'Home → School', points: earned, date: 'Just now' },
      ...prev,
    ]);
    alert(`Journey Completed! 🎉 You earned +${earned} points.`);
    setCurrentScreen('home');
    setActiveTab('home');
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: ME PAGE / PROFILE SETTINGS
  // --------------------------------------------------------------------------
  if (currentScreen === 'me') {
    return (
      <div className="app-viewport">
        <header className="page-header">
          <button className="home-back-btn" onClick={() => handleTabChange('home')}>
            🏠 Home
          </button>
          <h2>User Profile</h2>
        </header>

        <main className="page-content">
          <div className="profile-card">
            <div className="profile-avatar">HJ</div>
            <h3>{userProfile.name}</h3>
            <p className="sub-label">FlowSG Member • 1,260 pts</p>
          </div>

          <section className="settings-group">
            <h4>General Preferences</h4>
            <div className="setting-row">
              <label>Language</label>
              <select
                value={userProfile.language}
                onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Mandarin">Chinese (Mandarin)</option>
                <option value="Malay">Malay</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div className="setting-row">
              <label>Dark Mode</label>
              <input
                type="checkbox"
                checked={userProfile.darkMode}
                onChange={(e) => setUserProfile({ ...userProfile, darkMode: e.target.checked })}
              />
            </div>
          </section>

          <section className="settings-group">
            <h4>Route Preference Engine</h4>
            <p className="hint-text">Used by FlowSG to calculate weighted route scores.</p>
            {Object.keys(userProfile.preferences).map((pref) => (
              <div className="setting-row" key={pref}>
                <span className="capitalize">{pref.replace(/([A-Z])/g, ' $1')}</span>
                <input
                  type="checkbox"
                  checked={userProfile.preferences[pref]}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      preferences: {
                        ...userProfile.preferences,
                        [pref]: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            ))}
          </section>
        </main>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 2: FLOWSG REWARDS CENTER
  // --------------------------------------------------------------------------
  if (currentScreen === 'rewards') {
    return (
      <div className="app-viewport">
        <header className="page-header purple-header">
          <button className="home-back-btn white-btn" onClick={() => handleTabChange('home')}>
            🏠 Home
          </button>
          <h2>FlowSG Rewards</h2>
        </header>

        <main className="page-content">
          {/* Points & Rewards Card (Ref: image_5f95ad.png) */}
          <div className="rewards-balance-card">
            <div className="rewards-card-top">
              <div>
                <h3>Hi {userProfile.name}</h3>
                <p className="balance-pts">{pointsBalance} pts</p>
              </div>
              <button className="rewards-card-badge">🦋 Rewards Card</button>
            </div>
            <div className="rewards-banner-note">
              🎉 Thanks for choosing a less-crowded journey!
            </div>
          </div>

          {/* Recent Completed Journeys Log */}
          <section className="rewards-history">
            <h4>Recent Verified Journeys</h4>
            {recentJourneys.map((j) => (
              <div key={j.id} className="history-item">
                <div>
                  <strong>{j.route}</strong>
                  <br />
                  <small>{j.date}</small>
                </div>
                <span className="pts-earned">+{j.points} pts</span>
              </div>
            ))}
          </section>

          {/* DBS/POSB Deals Style Cards (Ref: image_5f9569.jpg) */}
          <section className="deals-section">
            <div className="deals-search">
              <input type="text" placeholder="Search for deals..." />
            </div>

            <div className="deals-tabs">
              <button className="deal-tab active">All</button>
              <button className="deal-tab">Featured</button>
              <button className="deal-tab">Nearby</button>
              <button className="deal-tab">Dine</button>
            </div>

            <div className="deals-grid">
              <div className="deal-card">
                <div className="deal-img cathay-img">Cathay Pacific</div>
                <h5>50% off flights every Wednesday</h5>
                <button className="view-btn">VIEW</button>
              </div>
              <div className="deal-card">
                <div className="deal-img kkday-img">KKday</div>
                <h5>Up to S$350 off bookings</h5>
                <button className="view-btn">VIEW</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 3: ROUTE COMPARISON DETAIL FRAME ("Home → School")
  // --------------------------------------------------------------------------
  if (currentScreen === 'route-detail') {
    return (
      <div className="app-viewport">
        <header className="page-header">
          <button className="home-back-btn" onClick={() => setCurrentScreen('home')}>
            ← Back
          </button>
          <h2>Home → School</h2>
        </header>

        <main className="page-content">
          <p className="section-label">Recommended for you</p>

          {/* Featured Route Recommendation Card */}
          <div className="recommendation-card">
            <div className="rec-title">
              <h3>{selectedRoute.title}</h3>
            </div>
            <div className="rec-metrics">
              <span className="main-time">{selectedRoute.time}</span>
              <span className="pts-tag">+{selectedRoute.points} pts</span>
            </div>

            <div className="status-indicators">
              <p><span className="dot green">●</span> {selectedRoute.crowding}</p>
              <p><span className="dot green">●</span> {selectedRoute.delayRisk}</p>
              <p>🚶 {selectedRoute.walkTime}</p>
            </div>

            <p className="delta-note">{selectedRoute.timeDelta}</p>

            <div className="reason-box">
              <p>{selectedRoute.reason}</p>
            </div>

            <button className="choose-route-btn" onClick={handleStartGPS}>
              Choose route
            </button>
          </div>

          {/* Secondary Route Comparison Cards */}
          <div className="other-routes-list">
            <h4>Other Options</h4>
            {MOCK_ROUTES.filter((r) => r.id !== selectedRoute.id).map((route) => (
              <div
                key={route.id}
                className="other-route-card"
                onClick={() => setSelectedRoute(route)}
              >
                <div className="other-head">
                  <strong>{route.title}</strong>
                  {route.points > 0 && <span className="pts-small">+{route.points} pts</span>}
                </div>
                <p className="other-time">{route.time}</p>
                <small className={`status-${route.crowdingLevel}`}>
                  ● {route.crowding}
                </small>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 4: LIVE TURN-BY-TURN GPS NAVIGATION FRAME
  // --------------------------------------------------------------------------
  if (currentScreen === 'gps') {
    return (
      <div className="app-viewport gps-viewport">
        {/* Top Floating GPS Banner */}
        <div className="gps-banner">
          <div className="turn-icon">➔</div>
          <div>
            <span className="gps-distance">In 100m</span>
            <h3>{GPS_STEPS[gpsStepIndex]}</h3>
          </div>
        </div>

        {/* Live GPS Map Canvas */}
        <div className="gps-map-container">
          <MapContainer
            center={selectedRoute.path[0]}
            zoom={16}
            zoomControl={false}
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedRoute.path[0]}>
              <Popup>Current GPS Position</Popup>
            </Marker>
            <Polyline positions={selectedRoute.path} color="#2563eb" weight={6} />
          </MapContainer>
        </div>

        {/* Bottom GPS Control Drawer */}
        <div className="gps-bottom-drawer">
          <div className="gps-meta">
            <div>
              <h2>{selectedRoute.time}</h2>
              <p>ETA 09:15 AM • 3.2 km</p>
            </div>
            <span className="badge-pts">+{selectedRoute.points} pts</span>
          </div>

          <div className="gps-actions">
            {gpsStepIndex < GPS_STEPS.length - 1 ? (
              <button
                className="primary-btn"
                onClick={() => setGpsStepIndex((prev) => prev + 1)}
              >
                Next Step ➔
              </button>
            ) : (
              <button className="primary-btn finish-btn" onClick={handleFinishJourney}>
                Complete Journey 🎉
              </button>
            )}
            <button className="secondary-btn" onClick={() => setCurrentScreen('home')}>
              End Route
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 5: MAIN DASHBOARD HOME SCREEN
  // --------------------------------------------------------------------------
  return (
    <div className="app-viewport">
      {/* Live Disruption Alert Banner */}
      <div className="top-status-pill">
        <span className="live-dot">●</span>
        <span>Live · 14:32 East-West Line: partial delay</span>
        <span className="status-count">3 more today</span>
      </div>

      {/* Profile Header */}
      <header className="app-header">
        <div className="user-info" onClick={() => handleTabChange('me')}>
          <div className="avatar">HJ</div>
          <div>
            <h3>Waypoint SG</h3>
            <p className="subtext">Plan quieter, earn points</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => handleTabChange('me')}>⚙️</button>
        </div>
      </header>

      {/* Search Input Section */}
      <section className="search-section">
        <h2>What's your plan today?</h2>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Where are you heading today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setCurrentScreen('route-detail')}
          />
        </div>

        {/* Destination Shortcuts */}
        <div className="quick-pills">
          <button onClick={() => setCurrentScreen('route-detail')}>Home → School</button>
          <button onClick={() => setCurrentScreen('route-detail')}>Morning to Downtown</button>
          <button onClick={() => setCurrentScreen('route-detail')}>Accessible to Hospital</button>
        </div>
      </section>

      {/* Main Interactive Map View */}
      <section className="map-view-container">
        <MapContainer
          center={[1.2966, 103.8501]}
          zoom={13}
          scrollWheelZoom={false}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[1.2966, 103.8501]} />
          <Polyline positions={MOCK_ROUTES[0].path} color="#2563eb" weight={5} />
        </MapContainer>

        <div className="map-card-overlay" onClick={() => setCurrentScreen('route-detail')}>
          <span className="badge-tag">RECOMMENDED · LESS CROWDED</span>
          <h4>18 min • 3.2 km</h4>
          <p>via Riverside Loop, low footfall</p>
        </div>
      </section>

      {/* Sticky Bottom Navigation */}
      <nav className="bottom-navigation">
        <button
          className={activeTab === 'home' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('home')}
        >
          🏠<span>Home</span>
        </button>
        <button
          className={activeTab === 'directions' ? 'nav-item active' : 'nav-item'}
          onClick={() => setCurrentScreen('route-detail')}
        >
          🧭<span>Direction</span>
        </button>
        <button
          className={activeTab === 'rewards' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('rewards')}
        >
          🎁<span>Reward</span>
        </button>
        <button
          className={activeTab === 'me' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('me')}
        >
          👤<span>Me</span>
        </button>
      </nav>
    </div>
  );
}