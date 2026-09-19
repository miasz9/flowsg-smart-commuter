import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import Directions from './pages/Directions'

function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="app">

      {page === 'home' && (
        <>
          <header className="header">
            <div className="logo">FlowSG</div>
          </header>

          <section className="greeting">
            <h2>Good morning, Rachel 👋</h2>
            <p>Where are you heading today?</p>
          </section>

          <section className="search">
            <input
              type="text"
              placeholder="Search destination"
            />
          </section>

          <section className="update">
            <strong>⚠️ Travel Update</strong>
            <p>No major disruptions detected.</p>
          </section>

          <section className="map">
            <Map />
          </section>
        </>
      )}

      {page === 'directions' && (
        <Directions />
      )}

      <nav className="bottom-nav">
        <button onClick={() => setPage('home')}>
          🏠
          <br />
          Home
        </button>

        <button onClick={() => setPage('directions')}>
          🧭
          <br />
          Directions
        </button>

        <button>
          🎁
          <br />
          Rewards
        </button>

        <button>
          👤
          <br />
          Me
        </button>
      </nav>

    </div>
  )
}

export default App