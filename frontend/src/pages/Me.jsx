import './Me.css'

export default function Me({
  routePreference,
  setRoutePreference
}) {
  return (
    <div className="me-page">
      <div className="profile-card">
        <div className="profile-avatar">R</div>

        <div className="profile-info">
          <h1>Rachel</h1>
          <p>Smart commuter</p>
          <span>🌱 Making greener journeys</span>
        </div>

        <button className="edit-button">Edit</button>
      </div>

      <div className="stats-card">
        <div className="stat">
          <strong>120</strong>
          <span>Points</span>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <strong>12</strong>
          <span>Trips</span>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <strong>4.2h</strong>
          <span>Time saved</span>
        </div>
      </div>

      <div className="preference-card">
        <div className="setting-icon">🧭</div>

        <div className="setting-content">
            <strong>Route preference</strong>

            <select
            value={routePreference}
            onChange={(event) =>
                setRoutePreference(event.target.value)
            }
            >
            <option value="least-crowded">
                Least Crowded
            </option>

            <option value="fastest">
                Fastest
            </option>

            <option value="accessible">
                Most Accessible
            </option>

            <option value="sheltered">
                Most Sheltered
            </option>
            </select>
        </div>
        </div>

      <section className="me-section">
        <h2>Journey preferences</h2>

        <div className="setting-card">
          <div className="setting-icon">🚇</div>
          <div className="setting-content">
            <strong>Preferred transport</strong>
            <p>MRT + Bus</p>
          </div>
          <span className="arrow">›</span>
        </div>

        <div className="setting-card">
          <div className="setting-icon">📍</div>
          <div className="setting-content">
            <strong>Usual destination</strong>
            <p>Raffles Place</p>
          </div>
          <span className="arrow">›</span>
        </div>

        <div className="setting-card">
          <div className="setting-icon">⏰</div>
          <div className="setting-content">
            <strong>Arrival preference</strong>
            <p>Arrive by 8:45 AM</p>
          </div>
          <span className="arrow">›</span>
        </div>
      </section>

      <section className="me-section">
        <h2>App preferences</h2>

        <div className="setting-card">
          <div className="setting-icon">🔤</div>
          <div className="setting-content">
            <strong>Font size</strong>
            <p>Default</p>
          </div>
          <span className="arrow">›</span>
        </div>

        <div className="setting-card">
          <div className="setting-icon">☀️</div>
          <div className="setting-content">
            <strong>Theme</strong>
            <p>Light</p>
          </div>
          <span className="arrow">›</span>
        </div>
      </section>
    </div>
    
  )
}