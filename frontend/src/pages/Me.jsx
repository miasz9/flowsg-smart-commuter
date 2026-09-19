import './Me.css'

export default function Me() {
  return (
    <div className="me-page">
      <div className="me-header">
        <div className="profile-icon">👤</div>

        <div>
          <p className="page-label">MY PROFILE</p>
          <h1>Rachel</h1>
          <p>Smart commuter</p>
        </div>
      </div>

      <section className="me-section">
        <h2>Preferences</h2>

        <div className="setting-item">
          <div>
            <strong>Preferred transport</strong>
            <p>MRT + Bus</p>
          </div>
          <span>›</span>
        </div>

        <div className="setting-item">
          <div>
            <strong>Usual destination</strong>
            <p>Raffles Place</p>
          </div>
          <span>›</span>
        </div>

        <div className="setting-item">
          <div>
            <strong>Arrival preference</strong>
            <p>Arrive by 8:45 AM</p>
          </div>
          <span>›</span>
        </div>
      </section>

      <section className="me-section">
        <h2>Accessibility</h2>

        <div className="setting-item">
          <div>
            <strong>Font size</strong>
            <p>Default</p>
          </div>
          <span>›</span>
        </div>

        <div className="setting-item">
          <div>
            <strong>Theme</strong>
            <p>Light</p>
          </div>
          <span>›</span>
        </div>
      </section>
    </div>
  )
}