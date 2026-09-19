import './Rewards.css'

export default function Rewards() {
  return (
    <div className="rewards-page">
      <div className="rewards-header">
        <p className="page-label">FLOWSG REWARDS</p>
        <h1>Your points</h1>
        <p>Help balance the network and earn rewards along the way.</p>
      </div>

      <div className="points-card">
        <div>
          <span className="points-label">CURRENT POINTS</span>
          <div className="points-value">120</div>
        </div>

        <div className="coin-icon">🪙</div>
      </div>

      <div className="goal-card">
        <div>
            <strong>Next reward</strong>
            <p>80 more points to unlock your next commuter reward.</p>
        </div>

        <div className="progress-bar">
            <div className="progress-fill"></div>
        </div>
      </div>

      <div className="rewards-section">
        <h2>How to earn</h2>

        <div className="reward-item">
          <div className="reward-icon">🟢</div>
          <div>
            <strong>Take a low-crowding route</strong>
            <p>+20 points</p>
          </div>
        </div>

        <div className="reward-item">
          <div className="reward-icon">🟡</div>
          <div>
            <strong>Take a moderate-crowding route</strong>
            <p>+10 points</p>
          </div>
        </div>

        <div className="reward-item">
          <div className="reward-icon">🚇</div>
          <div>
            <strong>Complete a recommended journey</strong>
            <p>+5 points</p>
          </div>
        </div>
      </div>

      <div className="rewards-section">
        <h2>Recent activity</h2>

        <div className="activity-item">
          <div>
            <strong>Tampines → Raffles Place</strong>
            <p>Recommended alternative</p>
          </div>
          <span>+20</span>
        </div>

        <div className="activity-item">
          <div>
            <strong>Jurong East → City Hall</strong>
            <p>Low crowding route</p>
          </div>
          <span>+20</span>
        </div>
      </div>
    </div>
  )
}