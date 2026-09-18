import './App.css'

function App() {
  return (
    <div className="app">

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

      <section className="map-placeholder">
        Map coming soon 🗺️
      </section>

      <nav className="bottom-nav">
        <button>🏠<br />Home</button>
        <button>🧭<br />Directions</button>
        <button>🎁<br />Rewards</button>
        <button>👤<br />Me</button>
      </nav>

    </div>
  )
}

export default App