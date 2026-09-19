import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import './App.css';

// Fix default Leaflet marker assets in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 4 Distinct Route Profiles
const ROUTE_OPTIONS = [
  {
    id: 'preferred',
    title: '⭐️ Your Preferred Route',
    subtitle: 'Via DTL (Downtown Line)',
    time: '42 min',
    distance: '3.2 km',
    points: 20,
    crowding: 'Low crowding',
    crowdingLevel: 'green',
    walkTime: '6 min walking',
    timeDelta: 'Recommended based on your history',
    category: 'preferred',
    path: [[1.2966, 103.8501], [1.2930, 103.8520], [1.2840, 103.8510]],
  },
  {
    id: 'sheltered',
    title: '☔ Sheltered Path Route',
    subtitle: 'Covered Walkway + EWL Transit',
    time: '46 min',
    distance: '3.5 km',
    points: 15,
    crowding: 'Moderate crowding',
    crowdingLevel: 'yellow',
    walkTime: '8 min fully sheltered',
    timeDelta: '4 min slower • 100% rain sheltered',
    category: 'sheltered',
    path: [[1.2966, 103.8501], [1.2910, 103.8490], [1.2840, 103.8510]],
  },
  {
    id: 'least-crowded',
    title: '🌿 Least Crowded Route',
    subtitle: 'Bus Loop 95 via Kent Ridge Park',
    time: '50 min',
    distance: '4.1 km',
    points: 30, // Highest points for least crowded
    crowding: 'Low footfall forecast',
    crowdingLevel: 'green',
    walkTime: '5 min walking',
    timeDelta: '8 min slower • +30 Bonus Points',
    category: 'least-crowded',
    path: [[1.2966, 103.8501], [1.3000, 103.8450], [1.2840, 103.8510]],
  },
  {
    id: 'accessible',
    title: '♿ Fully Accessible Route',
    subtitle: 'Step-Free Elevator & Ramp Access',
    time: '48 min',
    distance: '3.6 km',
    points: 10,
    crowding: 'Low crowding',
    crowdingLevel: 'green',
    walkTime: '0 stairs • Lift maintenance clear',
    timeDelta: '6 min slower • Fully barrier-free',
    category: 'accessible',
    path: [[1.2966, 103.8501], [1.2880, 103.8470], [1.2840, 103.8510]],
  },
];

// FlowSG Deals Catalog
const DEALS_CATALOG = [
  {
    id: 1,
    merchant: 'BreadTalk',
    title: '1-for-1 Flosss Bun Deal',
    category: 'dine',
    deadline: 'Redeem by 31 Oct 2026',
    terms: 'Valid at all Singapore outlets including NUS Geneo.',
    imgClass: 'breadtalk-img',
  },
  {
    id: 2,
    merchant: 'ChiCha San Chen',
    title: 'S$2.00 off Fresh Taro Boba Tea',
    category: 'dine',
    deadline: 'Redeem by 15 Nov 2026',
    terms: 'Valid with 100 FlowSG points redemption.',
    imgClass: 'chicha-img',
  },
  {
    id: 3,
    merchant: "McDonald's",
    title: 'Free Medium Fries with any Meal',
    category: 'featured',
    deadline: 'Redeem by 28 Oct 2026',
    terms: 'Applicable via FlowSG QR at self-checkout.',
    imgClass: 'mcd-img',
  },
  {
    id: 4,
    merchant: 'Cathay Pacific',
    title: '50% off flight bookings on Wednesdays',
    category: 'featured',
    deadline: 'Redeem by 31 Dec 2026',
    terms: 'Exclusive to FlowSG commuter pass holders.',
    imgClass: 'cathay-img',
  },
  {
    id: 5,
    merchant: 'KKday Singapore',
    title: 'Up to S$350 off local attraction passes',
    category: 'nearby',
    deadline: 'Redeem by 20 Nov 2026',
    terms: 'Includes Sentosa Skyline Luge & Haw Par Villa.',
    imgClass: 'kkday-img',
  },
];

const GPS_STEPS = [
  'Head south on Prince George\'s Park towards NUHS',
  'In 100m, turn right onto College Link',
  'Board Bus 95 at Kent Ridge MRT Station',
  'Alight at Science Park Drive Interchange',
  'You have arrived at your destination!',
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('Hee Jin');
  const [password, setPassword] = useState('');

  // App Screen State: 'home' | 'routes' | 'gps' | 'rewards' | 'me'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(ROUTE_OPTIONS[0]);
  const [gpsStepIndex, setGpsStepIndex] = useState(0);

  // User Preferences
  const [userProfile, setUserProfile] = useState({
    language: 'English',
    darkMode: true,
    preferences: {
      fastest: true,
      leastCrowded: true,
      sheltered: true,
      accessible: false,
    },
  });

  // Rewards Modals
  const [showRewardsCardModal, setShowRewardsCardModal] = useState(false);
  const [selectedDealModal, setSelectedDealModal] = useState(null);
  const [dealFilter, setDealFilter] = useState('all');
  const [pointsBalance, setPointsBalance] = useState(1260);

  useEffect(() => {
    if (userProfile.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [userProfile.darkMode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    if (tab === 'rewards') setCurrentScreen('rewards');
    if (tab === 'me') setCurrentScreen('me');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      setCurrentScreen('routes');
    }
  };

  const handleStartGPS = (route) => {
    setSelectedRoute(route);
    setGpsStepIndex(0);
    setCurrentScreen('gps');
  };

  // Filtered Deals Logic
  const filteredDeals = DEALS_CATALOG.filter((deal) => {
    if (dealFilter === 'all') return true;
    return deal.category === dealFilter;
  });

  // --------------------------------------------------------------------------
  // 1. AUTH SCREEN (LOGIN / CREATE ACCOUNT)
  // --------------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="app-viewport auth-viewport">
        <div className="auth-card">
          <div className="auth-header">
            <span className="brand-badge">FlowSG</span>
            <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>Set up your account to start commuting smarter</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="auth-form">
            <label>Your username</label>
            <input
              type="text"
              placeholder="e.g. Hee Jin"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {authMode === 'signup' && (
              <>
                <label>Email address</label>
                <input type="email" placeholder="name@mail.com" required />
              </>
            )}

            <label>Enter password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="primary-btn wide-btn">
              {authMode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-toggle">
            {authMode === 'login' ? (
              <p>Don't have an account? <span onClick={() => setAuthMode('signup')}>Sign Up</span></p>
            ) : (
              <p>Already have an account? <span onClick={() => setAuthMode('login')}>Log In</span></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. ME PAGE / USER PREFERENCES
  // --------------------------------------------------------------------------
  if (currentScreen === 'me') {
    return (
      <div className="app-viewport">
        <header className="page-header">
          <button className="home-back-btn" onClick={() => handleTabChange('home')}>
            🏠 Home
          </button>
          <h2>Profile Settings</h2>
        </header>

        <main className="page-content">
          <div className="profile-card">
            <div className="avatar-circle">{username.charAt(0)}</div>
            <h3>{username}</h3>
            <p className="sub-label">FlowSG Smart Commuter</p>
          </div>

          <section className="settings-group">
            <h4>General</h4>
            <div className="setting-row">
              <label>Language</label>
              <select
                value={userProfile.language}
                onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Bahasa Melayu">Bahasa Melayu</option>
                <option value="Chinese">华语 (Mandarin)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
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
            <h4>Your Preferences</h4>
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
  // 3. REWARDS PAGE
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
          {/* Rewards Card */}
          <div className="rewards-balance-card">
            <div className="rewards-card-top">
              <div>
                <h3>Hi {username}</h3>
                <p className="balance-pts">{pointsBalance} pts</p>
              </div>
              <button
                className="rewards-card-badge"
                onClick={() => setShowRewardsCardModal(true)}
              >
                💳 Rewards Card
              </button>
            </div>
            <div className="rewards-banner-note">
              🎉 Thanks for choosing a less-crowded journey!
            </div>
          </div>

          {/* Deals & Vouchers Section */}
          <section className="deals-section">
            <h4>Redeem Partner Deals</h4>
            <div className="deals-tabs">
              {['all', 'featured', 'nearby', 'dine'].map((cat) => (
                <button
                  key={cat}
                  className={`deal-tab ${dealFilter === cat ? 'active' : ''}`}
                  onClick={() => setDealFilter(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="deals-grid">
              {filteredDeals.map((deal) => (
                <div key={deal.id} className="deal-card">
                  <div className={`deal-img ${deal.imgClass}`}>
                    <span>{deal.merchant}</span>
                  </div>
                  <h5>{deal.title}</h5>
                  <p className="deadline-text">⏳ {deal.deadline}</p>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedDealModal(deal)}
                  >
                    VIEW
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Modal 1: Rewards Card & Barcode Overlay */}
        {showRewardsCardModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>FlowSG Commuter Pass</h3>
              <p>Scan barcode at partner outlets to earn/redeem points</p>
              <div className="barcode-box">
                <div className="barcode-lines">||| | |||| | | ||| || ||| |</div>
                <small>FLOWSG-8839-4201</small>
              </div>
              <button className="primary-btn wide-btn" onClick={() => setShowRewardsCardModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal 2: Deal Details & Terms */}
        {selectedDealModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>{selectedDealModal.merchant}</h3>
              <h4>{selectedDealModal.title}</h4>
              <p className="highlight-deadline">Redemption Deadline: {selectedDealModal.deadline}</p>
              <p className="deal-terms">{selectedDealModal.terms}</p>
              <button className="primary-btn wide-btn" onClick={() => setSelectedDealModal(null)}>
                Got It
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. ROUTE COMPARISON PAGE (Surfacing 4 Options)
  // --------------------------------------------------------------------------
  if (currentScreen === 'routes') {
    return (
      <div className="app-viewport">
        <header className="page-header">
          <button className="home-back-btn" onClick={() => setCurrentScreen('home')}>
            ← Back
          </button>
          <h2>Recommended Routes</h2>
        </header>

        <main className="page-content">
          <p className="section-subtitle">Showing 4 tailored routes for your destination:</p>

          <div className="route-options-list">
            {ROUTE_OPTIONS.map((route) => (
              <div key={route.id} className="route-comparison-card">
                <div className="route-head">
                  <h4>{route.title}</h4>
                  {route.points > 0 && <span className="pts-badge">+{route.points} pts</span>}
                </div>
                <p className="route-sub">{route.subtitle}</p>

                <div className="route-metrics">
                  <span className="time-val">{route.time}</span>
                  <span className="dist-val">• {route.distance}</span>
                </div>

                <div className="status-tags">
                  <span className={`tag ${route.crowdingLevel}`}>● {route.crowding}</span>
                  <span className="tag gray">🚶 {route.walkTime}</span>
                </div>

                <p className="delta-explanation">{route.timeDelta}</p>

                <button className="choose-route-btn" onClick={() => handleStartGPS(route)}>
                  Choose route
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 5. GPS NAVIGATION VIEW (Prince George's Park / NUHS GIS)
  // --------------------------------------------------------------------------
  if (currentScreen === 'gps') {
    return (
      <div className="app-viewport gps-viewport">
        {/* GPS Direction Banner */}
        <div className="gps-banner">
          <div className="gps-turn-arrow">↱</div>
          <div>
            <span className="gps-distance-text">In 100 meters</span>
            <h4>{GPS_STEPS[gpsStepIndex]}</h4>
          </div>
        </div>

        {/* GIS OpenStreetMap Display */}
        <div className="gps-map-container">
          <MapContainer
            center={[1.2930, 103.8520]}
            zoom={16}
            zoomControl={false}
            className="leaflet-map dark-gis-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Navigation Marker Cursor */}
            <Marker position={[1.2930, 103.8520]}>
              <Popup>Prince George's Park Routing</Popup>
            </Marker>
            <Polyline positions={selectedRoute.path} color="#00f2fe" weight={7} />
          </MapContainer>
        </div>

        {/* Bottom Drawer Controls */}
        <div className="gps-drawer">
          <div className="gps-info-row">
            <div>
              <h3>{selectedRoute.time}</h3>
              <p>ETA 09:20 AM • {selectedRoute.distance}</p>
            </div>
            <span className="earned-badge">+{selectedRoute.points} pts</span>
          </div>

          <div className="gps-button-group">
            {gpsStepIndex < GPS_STEPS.length - 1 ? (
              <button className="primary-btn wide-btn" onClick={() => setGpsStepIndex((p) => p + 1)}>
                Next Step ➔
              </button>
            ) : (
              <button
                className="primary-btn wide-btn finish-btn"
                onClick={() => {
                  setPointsBalance((prev) => prev + selectedRoute.points);
                  alert(`Journey Complete! Earned +${selectedRoute.points} points.`);
                  setCurrentScreen('home');
                }}
              >
                Arrived & Claim Points 🎉
              </button>
            )}
            <button className="secondary-btn wide-btn" onClick={() => setCurrentScreen('home')}>
              Exit GPS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 6. MAIN HOME DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="app-viewport">
      {/* Live Disruption Alert Banner */}
      <div className="top-status-pill">
        <span className="live-dot">●</span>
        <span>Live · 14:32 East-West Line: partial delay</span>
        <span className="status-count">3 disruptions</span>
      </div>

      {/* Simplified FlowSG Header */}
      <header className="app-header simple-header">
        <div className="brand-title">FlowSG</div>
      </header>

      {/* Main Search Bar & Quick Destinations */}
      <section className="search-section">
        <h2>Where are you heading today?</h2>
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Where are you heading today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-enter-btn">➔</button>
        </form>

        <div className="quick-pills">
          <button onClick={() => setCurrentScreen('routes')}>Home → School</button>
          <button onClick={() => setCurrentScreen('routes')}>Morning to Downtown</button>
          <button onClick={() => setCurrentScreen('routes')}>Accessible to Hospital</button>
        </div>
      </section>

      {/* OpenStreetMap Area */}
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
          <Polyline positions={ROUTE_OPTIONS[0].path} color="#2563eb" weight={5} />
        </MapContainer>

        <div className="map-card-overlay" onClick={() => setCurrentScreen('routes')}>
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
          onClick={() => setCurrentScreen('routes')}
        >
          🧭<span>Directions</span>
        </button>
        <button
          className={activeTab === 'rewards' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('rewards')}
        >
          🎁<span>Rewards</span>
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