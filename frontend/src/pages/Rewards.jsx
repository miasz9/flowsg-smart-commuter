import { useState } from 'react'
import './Rewards.css'

export default function Rewards() {
  const [pointsBalance, setPointsBalance] = useState(120)
  const [dealFilter, setDealFilter] = useState('featured')
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [pointsMessage, setPointsMessage] = useState('')

  return (
    <div className="rewards-page">
      <header className="page-header purple-header">
        <div>
          <p className="page-label">FLOWSG REWARDS</p>
          <h1>Your points</h1>
          <p>Help balance the network and earn rewards along the way.</p>
        </div>
      </header>

      <div className="rewards-balance-card">
        <div className="rewards-card-top">
          <span className="points-label">
            CURRENT POINTS
          </span>

          <span className="rewards-card-badge">
            🪙 FlowSG
          </span>
        </div>

        <div className="balance-pts">
          {pointsBalance}
        </div>

        <p>
          Keep choosing smarter journeys to earn more.
        </p>
      </div>

      <div className="rewards-section">
        <div className="rewards-card-top">
          <div>
            <strong>Next reward</strong>
            <p>
              {Math.max(200 - pointsBalance, 0)} more points to unlock your next commuter reward.
            </p>
          </div>

          <span className="rewards-card-badge">
            Target: 200 pts
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((pointsBalance / 200) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="rewards-section">
        <h2>How to earn</h2>

        {pointsMessage && (
          <p className="points-feedback">
            {pointsMessage}
          </p>
        )}

        <button
          className="earning-card"
          onClick={() => {
            setPointsBalance(pointsBalance + 20)
            setPointsMessage('+20 points earned!')
          }}
        >
          <div className="reward-icon">🟢</div>

          <div>
            <strong>Take a low-crowding route</strong>
            <p>+20 points</p>
          </div>
        </button>

        <button
          className="earning-card"
          onClick={() => {
            setPointsBalance(pointsBalance + 10)
            setPointsMessage('+10 points earned!')
          }}
        >
          <div className="reward-icon">🟡</div>

          <div>
            <strong>Take a moderate-crowding route</strong>
            <p>+10 points</p>
          </div>
        </button>

        <button
          className="earning-card"
          onClick={() => {
            setPointsBalance(pointsBalance + 5)
            setPointsMessage('+5 points earned!')
          }}
        >
          <div className="reward-icon">🚇</div>

          <div>
            <strong>Complete a recommended journey</strong>
            <p>+5 points</p>
          </div>
        </button>
      </div>

      <div className="rewards-section">
        <h2>Recent activity</h2>

        <div className="activity-card">
          <div>
            <strong>Tampines → Raffles Place</strong>
            <p>Recommended alternative</p>
          </div>
          <span>+20</span>
        </div>

        <div className="activity-card">
          <div>
            <strong>Jurong East → City Hall</strong>
            <p>Low crowding route</p>
          </div>
          <span>+20</span>
        </div>
      </div>

      <div className="rewards-section">
        <h2>Commuter rewards</h2>

        <div className="deals-tabs">
          <button
            className={`deal-tab ${
              dealFilter === 'featured' ? 'active' : ''
            }`}
            onClick={() => setDealFilter('featured')}
          >
            Featured
          </button>

          <button
            className={`deal-tab ${
              dealFilter === 'nearby' ? 'active' : ''
            }`}
            onClick={() => setDealFilter('nearby')}
          >
            Nearby
          </button>

          <button
            className={`deal-tab ${
              dealFilter === 'food' ? 'active' : ''
            }`}
            onClick={() => setDealFilter('food')}
          >
            Food
          </button>
        </div>

        <div className="deals-grid">
          {dealFilter === 'featured' && (
            <>
              <div className="deal-card">
                <div className="deal-img breadtalk-img">
                  🍞
                </div>

                <div>
                  <strong>BreadTalk</strong>
                  <p>Free bun with selected purchase</p>
                  <span>200 pts</span>
                </div>

                <button
                  className="view-btn"
                  onClick={() =>
                    setSelectedDeal({
                      name: 'BreadTalk',
                      reward: 'Free bun with selected purchase',
                      points: 200,
                    })
                  }
                >
                  View
                </button>
              </div>

              <div className="deal-card">
                <div className="deal-img chicha-img">
                  🧋
                </div>

                <div>
                  <strong>ChiCha San Chen</strong>
                  <p>$1 off selected drinks</p>
                  <span>300 pts</span>
                </div>

                <button
                  className="view-btn"
                  onClick={() =>
                    setSelectedDeal({
                      name: 'ChiCha San Chen',
                      reward: '$1 off selected drinks',
                      points: 300,
                    })
                  }
                >
                  View
                </button>
              </div>
            </>
          )}

          {dealFilter === 'nearby' && (
            <div className="deal-card">
              <div className="deal-img chicha-img">
                🧋
              </div>

              <div>
                <strong>ChiCha San Chen</strong>
                <p>$1 off selected drinks</p>
                <span>300 pts</span>
              </div>

              <button
                className="view-btn"
                onClick={() =>
                  setSelectedDeal({
                    name: 'ChiCha San Chen',
                    reward: '$1 off selected drinks',
                    points: 300,
                  })
                }
              >
                View
              </button>
            </div>
          )}

          {dealFilter === 'food' && (
            <div className="deal-card">
              <div className="deal-img breadtalk-img">
                🍞
              </div>

              <div>
                <strong>BreadTalk</strong>
                <p>Free bun with selected purchase</p>
                <span>200 pts</span>
              </div>

              <button
                className="view-btn"
                onClick={() =>
                  setSelectedDeal({
                    name: 'BreadTalk',
                    reward: 'Free bun with selected purchase',
                    points: 200,
                  })
                }
              >
                View
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedDeal && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDeal(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedDeal.name}</h2>

            <p>{selectedDeal.reward}</p>

            <strong>{selectedDeal.points} pts</strong>

            <div>
              <button
                className="primary-btn"
                onClick={() => {
                  if (selectedDeal.points <= pointsBalance) {
                    setPointsBalance(
                      pointsBalance - selectedDeal.points
                    )

                    alert(`You redeemed ${selectedDeal.name}!`)
                    setSelectedDeal(null)
                  } else {
                    alert(
                      `You need ${
                        selectedDeal.points - pointsBalance
                      } more points to redeem this reward.`
                    )
                  }
                }}
              >
                Redeem
              </button>

              <button
                className="secondary-btn"
                onClick={() => setSelectedDeal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}