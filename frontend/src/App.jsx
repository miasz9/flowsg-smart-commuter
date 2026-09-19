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

// Full Translation Dictionary including Route Preferences
const TRANSLATIONS = {
  English: {
    home: 'Home',
    directions: 'Directions',
    rewards: 'Rewards',
    me: 'Me',
    searchPlaceholder: 'Where are you heading today?',
    headingQuestion: 'Where are you heading today?',
    profileSettings: 'Profile Settings',
    general: 'General',
    language: 'Language',
    darkMode: 'Dark Mode',
    yourPreferences: 'Your Preferences',
    signOut: 'Sign Out',
    liveUpdates: 'Live · 14:32 East-West Line: partial delay',
    disruptions: '3 disruptions',
    prefFastest: 'Fastest',
    prefLeastCrowded: 'Least Crowded',
    prefSheltered: 'Sheltered',
    prefAccessible: 'Accessible',
  },
  'Bahasa Melayu': {
    home: 'Utama',
    directions: 'Arah',
    rewards: 'Ganjaran',
    me: 'Profil',
    searchPlaceholder: 'Ke mana anda hendak pergi hari ini?',
    headingQuestion: 'Ke mana anda hendak pergi hari ini?',
    profileSettings: 'Tetapan Profil',
    general: 'Umum',
    language: 'Bahasa',
    darkMode: 'Mod Gelap',
    yourPreferences: 'Pilihan Anda',
    signOut: 'Log Keluar',
    liveUpdates: 'Langsung · 14:32 Laluan East-West: gangguan separa',
    disruptions: '3 gangguan',
    prefFastest: 'Terpantas',
    prefLeastCrowded: 'Kurang Sesak',
    prefSheltered: 'Berbumbung',
    prefAccessible: 'Bebas Halangan',
  },
  Chinese: {
    home: '首页',
    directions: '路线',
    rewards: '奖励',
    me: '我的',
    searchPlaceholder: '您今天想去哪里？',
    headingQuestion: '您今天想去哪里？',
    profileSettings: '个人设置',
    general: '常规',
    language: '语言',
    darkMode: '深色模式',
    yourPreferences: '偏好设置',
    signOut: '退出登录',
    liveUpdates: '实时 · 14:32 东西线：部分延迟',
    disruptions: '3条中断信息',
    prefFastest: '最快路线',
    prefLeastCrowded: '最少拥挤',
    prefSheltered: '全全程遮阳遮雨',
    prefAccessible: '无障碍通行',
  },
  Tamil: {
    home: 'முகப்பு',
    directions: 'திசைகள்',
    rewards: 'சலுகைகள்',
    me: 'சுயவிவரம்',
    searchPlaceholder: 'இன்று எங்கு செல்ல விரும்புகிறீர்கள்?',
    headingQuestion: 'இன்று எங்கு செல்ல விரும்புகிறீர்கள்?',
    profileSettings: 'சுயவிவர அமைப்புகள்',
    general: 'பொதுவானவை',
    language: 'மொழி',
    darkMode: 'இருண்ட பயன்முறை',
    yourPreferences: 'உங்கள் விருப்பங்கள்',
    signOut: 'வெளியேறு',
    liveUpdates: 'நேரலை · 14:32 கிழக்கு-மேற்கு பாதை: தாமதம்',
    disruptions: '3 இடையூறுகள்',
    prefFastest: 'வேகமான பாதை',
    prefLeastCrowded: 'கூட்டம் குறைவானது',
    prefSheltered: 'நிழல் பாதை',
    prefAccessible: 'எளிதாக அணுகக்கூடியது',
  },
};

// Default Route Data Sets
const SCHOOL_ROUTES = [
  {
    id: 'nus-dtl',
    title: '⭐️ Alternative via DTL to NUS',
    destination: 'NUS Kent Ridge',
    time: '42 min',
    distance: '3.2 km',
    points: 20,
    crowding: 'Low Crowded',
    crowdingLevel: 'green',
    walkTime: '6 min walking',
    timeDelta: 'Direct access to Faculty of Engineering',
    path: [[1.2966, 103.8501], [1.2930, 103.8520], [1.2950, 103.7768]],
  },
  {
    id: 'nus-bus',
    title: '🌿 Bus 95 Express Loop',
    destination: 'NUS Kent Ridge Campus',
    time: '48 min',
    distance: '3.8 km',
    points: 30,
    crowding: 'Least Crowded',
    crowdingLevel: 'green',
    walkTime: '4 min walking',
    timeDelta: '6 min slower • +30 Bonus Points',
    path: [[1.2966, 103.8501], [1.3000, 103.8450], [1.2950, 103.7768]],
  },
];

const WOODLANDS_ROUTES = [
  {
    id: 'woodlands-nsl',
    title: '⭐️ North-South Line Direct',
    destination: 'Woodlands Integrated Hub',
    time: '45 min',
    distance: '21.4 km',
    points: 25,
    crowding: 'Low Crowded',
    crowdingLevel: 'green',
    walkTime: '3 min fully sheltered link',
    timeDelta: 'Direct express train via NSL',
    path: [[1.2966, 103.8501], [1.3500, 103.8300], [1.4360, 103.7860]],
  },
  {
    id: 'woodlands-tel',
    title: '☂️ Thomson-East Coast Line Loop',
    destination: 'Woodlands South / Civic Centre',
    time: '52 min',
    distance: '23.1 km',
    points: 35,
    crowding: 'Least Crowded',
    crowdingLevel: 'green',
    walkTime: '2 min underground transfer',
    timeDelta: 'Avoids EWL Signal Fault • +35 Bonus Points',
    path: [[1.2966, 103.8501], [1.3800, 103.8100], [1.4360, 103.7860]],
  },
];

const DOWNTOWN_ROUTES = [
  {
    id: 'guoco-ewl',
    title: '⭐️ Direct Transit to Guoco Tower',
    destination: 'Guoco Tower (Tanjong Pagar)',
    time: '28 min',
    distance: '8.5 km',
    points: 10,
    crowding: 'Moderate Crowded',
    crowdingLevel: 'yellow',
    walkTime: '2 min direct basement link',
    timeDelta: 'Fastest route to Central Business District',
    path: [[1.2966, 103.8501], [1.2820, 103.8440], [1.2764, 103.8446]],
  },
];

const DEALS_CATALOG = [
  { id: 1, merchant: 'BreadTalk', title: '1-for-1 Flosss Bun Deal', category: 'dine', deadline: 'Redeem by 31 Oct 2026', terms: 'Valid at NUS Geneo branch.', imgClass: 'breadtalk-img' },
  { id: 2, merchant: 'ChiCha San Chen', title: 'S$2.00 off Fresh Taro Boba', category: 'dine', deadline: 'Redeem by 15 Nov 2026', terms: 'Valid with 100 FlowSG points.', imgClass: 'chicha-img' },
  { id: 3, merchant: "McDonald's", title: 'Free Medium Fries with Meal', category: 'featured', deadline: 'Redeem by 28 Oct 2026', terms: 'Scan FlowSG QR code at checkout.', imgClass: 'mcd-img' },
  { id: 4, merchant: 'Cathay Pacific', title: '50% off flight bookings', category: 'featured', deadline: 'Redeem by 31 Dec 2026', terms: 'Exclusive to FlowSG pass holders.', imgClass: 'cathay-img' },
];

const GPS_STEPS = [
  'Head south on Prince George\'s Park towards NUHS',
  'In 100m, turn right onto College Link',
  'Board Bus 95 at Kent Ridge MRT Station',
  'Alight at Science Park Drive Interchange',
  'You have arrived at your destination!',
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('Hee Jin');
  const [password, setPassword] = useState('');

  // App Navigation: 'home' | 'routes' | 'gps' | 'rewards' | 'me'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');

  // Search & Dynamic Route Engine
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRouteSet, setActiveRouteSet] = useState(SCHOOL_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(SCHOOL_ROUTES[0]);
  const [gpsStepIndex, setGpsStepIndex] = useState(0);

  // Modals
  const [showDisruptionModal, setShowDisruptionModal] = useState(false);
  const [showRewardsCardModal, setShowRewardsCardModal] = useState(false);
  const [selectedDealModal, setSelectedDealModal] = useState(null);
  const [dealFilter, setDealFilter] = useState('all');
  const [pointsBalance, setPointsBalance] = useState(1260);

  // User Profile Preferences
  const [userProfile, setUserProfile] = useState({
    language: 'English',
    darkMode: true,
    preferences: {
      prefFastest: true,
      prefLeastCrowded: true,
      prefSheltered: true,
      prefAccessible: false,
    },
  });

  const t = TRANSLATIONS[userProfile.language] || TRANSLATIONS.English;

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

  // Requirement 3: Dynamic Destination Routing (Woodlands, Downtown, Custom)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    
    if (query === '') return;

    if (query.includes('woodland')) {
      setActiveRouteSet(WOODLANDS_ROUTES);
      setSelectedRoute(WOODLANDS_ROUTES[0]);
    } else if (query.includes('downtown') || query.includes('guoco')) {
      setActiveRouteSet(DOWNTOWN_ROUTES);
      setSelectedRoute(DOWNTOWN_ROUTES[0]);
    } else {
      // Custom dynamic destination generator
      const customRoutes = [
        {
          id: 'custom-1',
          title: `⭐️ Express Route to ${searchQuery}`,
          destination: searchQuery,
          time: '35 min',
          distance: '12.4 km',
          points: 20,
          crowding: 'Low Crowded',
          crowdingLevel: 'green',
          walkTime: '5 min walking',
          timeDelta: 'Optimal direct route via MRT',
          path: [[1.2966, 103.8501], [1.3200, 103.8200], [1.3500, 103.8000]],
        },
        {
          id: 'custom-2',
          title: `🌿 Sheltered & Quiet Route to ${searchQuery}`,
          destination: searchQuery,
          time: '42 min',
          distance: '13.8 km',
          points: 30,
          crowding: 'Least Crowded',
          crowdingLevel: 'green',
          walkTime: '3 min sheltered',
          timeDelta: '7 min slower • +30 Bonus Points',
          path: [[1.2966, 103.8501], [1.3100, 103.8300], [1.3500, 103.8000]],
        },
      ];
      setActiveRouteSet(customRoutes);
      setSelectedRoute(customRoutes[0]);
    }
    setCurrentScreen('routes');
  };

  const handleQuickSelect = (type) => {
    if (type === 'school') {
      setSearchQuery('NUS Kent Ridge');
      setActiveRouteSet(SCHOOL_ROUTES);
      setSelectedRoute(SCHOOL_ROUTES[0]);
    } else if (type === 'woodlands') {
      setSearchQuery('Woodlands Integrated Hub');
      setActiveRouteSet(WOODLANDS_ROUTES);
      setSelectedRoute(WOODLANDS_ROUTES[0]);
    } else {
      setSearchQuery('Guoco Tower (Downtown)');
      setActiveRouteSet(DOWNTOWN_ROUTES);
      setSelectedRoute(DOWNTOWN_ROUTES[0]);
    }
    setCurrentScreen('routes');
  };

  const handleStartGPS = (route) => {
    setSelectedRoute(route);
    setGpsStepIndex(0);
    setCurrentScreen('gps');
  };

  const filteredDeals = DEALS_CATALOG.filter((deal) => {
    if (dealFilter === 'all') return true;
    return deal.category === dealFilter;
  });

  // --------------------------------------------------------------------------
  // AUTH SCREEN
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
  // ME PAGE / PROFILE & FULL TRANSLATION (Requirement 1 & 2)
  // --------------------------------------------------------------------------
  if (currentScreen === 'me') {
    return (
      <div className="app-viewport">
        <header className="page-header">
          <button className="home-back-btn" onClick={() => handleTabChange('home')}>
            🏠 {t.home}
          </button>
          <h2>{t.profileSettings}</h2>
        </header>

        <main className="page-content">
          <div className="profile-card">
            <div className="avatar-circle">{username.charAt(0)}</div>
            <h3>{username}</h3>
            <p className="sub-label">FlowSG Member • {pointsBalance} pts</p>
          </div>

          <section className="settings-group">
            <h4>{t.general}</h4>
            <div className="setting-row">
              <label>{t.language}</label>
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
              <label>{t.darkMode}</label>
              <input
                type="checkbox"
                checked={userProfile.darkMode}
                onChange={(e) => setUserProfile({ ...userProfile, darkMode: e.target.checked })}
              />
            </div>
          </section>

          {/* Fully Translated Preferences (Requirement 2) */}
          <section className="settings-group">
            <h4>{t.yourPreferences}</h4>
            {['prefFastest', 'prefLeastCrowded', 'prefSheltered', 'prefAccessible'].map((prefKey) => (
              <div className="setting-row" key={prefKey}>
                <span>{t[prefKey]}</span>
                <input
                  type="checkbox"
                  checked={userProfile.preferences[prefKey]}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      preferences: {
                        ...userProfile.preferences,
                        [prefKey]: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            ))}
          </section>

          <button className="signout-btn wide-btn" onClick={() => setIsLoggedIn(false)}>
            🚪 {t.signOut}
          </button>
        </main>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // REWARDS PAGE
  // --------------------------------------------------------------------------
  if (currentScreen === 'rewards') {
    return (
      <div className="app-viewport">
        <header className="page-header purple-header">
          <button className="home-back-btn white-btn" onClick={() => handleTabChange('home')}>
            🏠 {t.home}
          </button>
          <h2>FlowSG Rewards</h2>
        </header>

        <main className="page-content">
          <div className="rewards-balance-card">
            <div className="rewards-card-top">
              <div>
                <h3>Hi {username}</h3>
                <p className="balance-pts">{pointsBalance} pts</p>
              </div>
              <button className="rewards-card-badge" onClick={() => setShowRewardsCardModal(true)}>
                💳 Rewards Card
              </button>
            </div>
            <div className="rewards-banner-note">
              🎉 Thanks for choosing a less-crowded journey!
            </div>
          </div>

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
                  <button className="view-btn" onClick={() => setSelectedDealModal(deal)}>
                    VIEW
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

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
  // ROUTE OPTIONS SCREEN
  // --------------------------------------------------------------------------
  if (currentScreen === 'routes') {
    return (
      <div className="app-viewport">
        <header className="page-header">
          <button className="home-back-btn" onClick={() => setCurrentScreen('home')}>
            ← Back
          </button>
          <h2>Route Options</h2>
        </header>

        <main className="page-content">
          <p className="section-subtitle">Tailored options for {selectedRoute.destination || 'your journey'}:</p>

          <div className="route-options-list">
            {activeRouteSet.map((route) => (
              <div key={route.id} className="route-comparison-card">
                <div className="route-head">
                  <h4>{route.title}</h4>
                  {route.points > 0 && <span className="pts-badge">+{route.points} pts</span>}
                </div>

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
  // GPS NAVIGATION FRAME
  // --------------------------------------------------------------------------
  if (currentScreen === 'gps') {
    return (
      <div className="app-viewport gps-viewport">
        <div className="gps-banner">
          <div className="gps-turn-arrow">↱</div>
          <div>
            <span className="gps-distance-text">In 100 meters</span>
            <h4>{GPS_STEPS[gpsStepIndex]}</h4>
          </div>
        </div>

        <div className="gps-map-frame">
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
            <Marker position={[1.2930, 103.8520]}>
              <Popup>Navigation Active: Prince George's Park</Popup>
            </Marker>
            <Polyline positions={selectedRoute.path} color="#00f2fe" weight={7} />
          </MapContainer>
        </div>

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
  // HOME DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="app-viewport">
      {/* Live Disruption Alert Banner */}
      <div className="top-status-pill" onClick={() => setShowDisruptionModal(true)}>
        <span className="live-dot">●</span>
        <span className="status-text">{t.liveUpdates}</span>
        <span className="status-count">{t.disruptions} ℹ️</span>
      </div>

      <header className="app-header simple-header">
        <div className="brand-title">FlowSG</div>
      </header>

      {/* Main Search Bar (Supports Woodlands & Custom Destinations) */}
      <section className="search-section">
        <h2>{t.headingQuestion}</h2>
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-enter-btn">➔</button>
        </form>

        <div className="quick-pills">
          <button onClick={() => handleQuickSelect('school')}>NUS Kent Ridge</button>
          <button onClick={() => handleQuickSelect('woodlands')}>Woodlands Hub</button>
          <button onClick={() => handleQuickSelect('downtown')}>Guoco Tower</button>
        </div>
      </section>

      {/* Main OpenStreetMap Display */}
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
          <Polyline positions={SCHOOL_ROUTES[0].path} color="#2563eb" weight={5} />
        </MapContainer>

        <div className="map-card-overlay" onClick={() => handleStartGPS(SCHOOL_ROUTES[0])}>
          <span className="badge-tag">RECOMMENDED · LESS CROWDED</span>
          <h4>18 min • 3.2 km</h4>
          <p>via Riverside Loop, low footfall ➔ <strong>Tap to start GPS</strong></p>
        </div>
      </section>

      {/* Live Disruptions Modal */}
      {showDisruptionModal && (
        <div className="modal-overlay">
          <div className="modal-card disruption-modal">
            <h3>🚨 Active Transit Disruptions</h3>
            <div className="disruption-item">
              <strong>East-West Line (EWL)</strong>
              <p>Signal fault between Buona Vista & Jurong East. 15-min delay.</p>
            </div>
            <div className="disruption-item">
              <strong>Kent Ridge MRT (Exit B Closure)</strong>
              <p>Lift maintenance in progress. Use sheltered ramp at Exit A.</p>
            </div>
            <div className="disruption-item">
              <strong>Heavy Rain Advisory</strong>
              <p>High rainfall recorded near Science Park Drive.</p>
            </div>
            <button className="primary-btn wide-btn" onClick={() => setShowDisruptionModal(false)}>
              Close Updates
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation */}
      <nav className="bottom-navigation">
        <button
          className={activeTab === 'home' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('home')}
        >
          🏠<span>{t.home}</span>
        </button>
        <button
          className={activeTab === 'directions' ? 'nav-item active' : 'nav-item'}
          onClick={() => {
            setActiveTab('directions');
            setCurrentScreen('routes');
          }}
        >
          🧭<span>{t.directions}</span>
        </button>
        <button
          className={activeTab === 'rewards' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('rewards')}
        >
          🎁<span>{t.rewards}</span>
        </button>
        <button
          className={activeTab === 'me' ? 'nav-item active' : 'nav-item'}
          onClick={() => handleTabChange('me')}
        >
          👤<span>{t.me}</span>
        </button>
      </nav>
    </div>
  );
}