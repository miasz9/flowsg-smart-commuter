import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import Directions from './pages/Directions'
import Rewards from './pages/Rewards'
import Me from './pages/Me'

function App() {
  const [page, setPage] = useState('home')
  const [destination, setDestination] = useState('')
  const [routePreference, setRoutePreference] = useState('least-crowded')

  return (
    <div className="app-viewport">

      {page === 'home' && (
        <>
          <div className="top-status-pill">
            <span className="live-dot"></span>
            Live travel updates
          </div>

          <header className="simple-header">
            <div className="brand-title">FlowSG</div>
          </header>

          <section className="search-section">
            <h2>Where are you heading today?</h2>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <button
                className="search-enter-btn"
                onClick={() => setPage('directions')}
              >
                →
              </button>
            </div>

          <div className="quick-pills">
            <button onClick={() => setPage('directions')}>
              🏫 NUS
            </button>

            <button onClick={() => setPage('directions')}>
              🚇 Raffles Place
            </button>

            <button onClick={() => setPage('directions')}>
              🌳 Tampines
            </button>
          </div>
          </section>

          <section className="map-view-container">
            <Map />
          </section>

          <section className="settings-group">
            <div className="setting-row">
              <div>
                <strong>⚠️ Travel Update</strong>
                <p>No major disruptions detected.</p>
              </div>
              <span className="live-dot"></span>
            </div>
          </section>
        </>
      )}

      {page === 'directions' && (
        <Directions
          routePreference={routePreference}
          initialDestination={destination}
        />
      )}

      {page === 'rewards' && (
        <Rewards />
      )}

      {page === 'me' && (
        <Me
          routePreference={routePreference}
          setRoutePreference={setRoutePreference}
        />
      )}

      <nav className="bottom-navigation">
        <button
          className={page === 'home' ? 'nav-item active' : 'nav-item'}
          onClick={() => setPage('home')}
        >
          🏠
          <br />
          Home
        </button>

        <button 
          className={page === 'directions' ? 'nav-item active' : 'nav-item'}
          onClick={() => setPage('directions')}>
          🧭
          <br />
          Directions
        </button>

        <button 
          className={page === 'rewards' ? 'nav-item active' : 'nav-item'}
          onClick={() => setPage('rewards')}>
          🎁
          <br />
          Rewards
        </button>

        <button 
          className={page === 'me' ? 'nav-item active' : 'nav-item'}
          onClick={() => setPage('me')}>
          👤
          <br />
          Me
        </button>
      </nav>

    </div>
  )
}

export default App