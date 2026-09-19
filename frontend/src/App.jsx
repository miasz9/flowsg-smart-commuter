import React, { useState } from 'react';
import './App.css';

// Mock routing options evaluated by your decision heuristic
const MOCK_ROUTES = [
  {
    id: 1,
    name: 'Via DTL (Sheltered)',
    timeMinutes: 42,
    crowding: 'Low',
    points: 30,
    isSheltered: true,
    isFastest: true,
    recommendationReason: '4 mins faster & sheltered from predicted rainfall.',
  },
  {
    id: 2,
    name: 'Usual Route (EWL / Bus)',
    timeMinutes: 48,
    crowding: 'High',
    points: 10,
    isSheltered: false,
    isFastest: false,
    recommendationReason: 'Higher platform crowding detected at interchange.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSort, setSelectedSort] = useState('recommended');
  const [selectedRoute, setSelectedRoute] = useState(MOCK_ROUTES[0]);

  return (
    <div className="app">
      {/* Header & Weather Disruption Banner */}
      <header className="header">
        <div className="user-profile">
          <div className="avatar">FJ</div>
          <div>
            <h2>Good morning, Hee Jin</h2>
            <p className="subtitle">Where are you heading today?</p>
          </div>
        </div>

        <div className="travel-update-banner">
          <strong>🌧️ Travel Update:</strong> Heavy rain along walking path.
          Consider taking the sheltered DTL alternative.
        </div>
      </header>

      {/* Destination Search */}
      <section className="search">
        <input 
          type="text" 
          placeholder="Where to? (e.g., NUS Kent Ridge, One@KentRidge)" 
          className="search-input"
        />
      </section>

      {/* Main Map View Area */}
      <section className="map-container">
        <div className="map-placeholder">
          {/* Replace with Leaflet / OpenStreetMap component */}
          <p>📍 Interactive OSM Map Active</p>
          <small>Showing route: {selectedRoute.name}</small>
        </div>
      </section>

      {/* Route Decision & Sorting Options */}
      <section className="route-selection">
        <div className="sort-bar">
          <button 
            className={selectedSort === 'recommended' ? 'active' : ''} 
            onClick={() => setSelectedSort('recommended')}
          >
            Recommended ✨
          </button>
          <button 
            className={selectedSort === 'fastest' ? 'active' : ''} 
            onClick={() => setSelectedSort('fastest')}
          >
            Fastest ⚡
          </button>
          <button 
            className={selectedSort === 'sheltered' ? 'active' : ''} 
            onClick={() => setSelectedSort('sheltered')}
          >
            Sheltered ☔
          </button>
        </div>

        <div className="route-cards">
          {MOCK_ROUTES.map((route) => (
            <div 
              key={route.id} 
              className={`route-card ${selectedRoute.id === route.id ? 'selected' : ''}`}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="route-header">
                <h3>{route.name}</h3>
                <span className="badge">+{route.points} pts</span>
              </div>
              <p>{route.timeMinutes} mins • Crowding: {route.crowding}</p>
              <div className="transparency-note">
                <small>💡 <strong>Why:</strong> {route.recommendationReason}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
          🏠<br />Home
        </button>
        <button className={activeTab === 'directions' ? 'active' : ''} onClick={() => setActiveTab('directions')}>
          🧭<br />Directions
        </button>
        <button className={activeTab === 'rewards' ? 'active' : ''} onClick={() => setActiveTab('rewards')}>
          🎁<br />Rewards
        </button>
        <button className={activeTab === 'me' ? 'active' : ''} onClick={() => setActiveTab('me')}>
          👤<br />Me
        </button>
      </nav>
    </div>
  );
}