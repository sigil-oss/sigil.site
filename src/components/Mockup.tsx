export function Mockup() {
  return (
    <div className="wrap">
      <section>
        <div className="section-eyebrow">[ 02 / THE INTERFACE ]</div>
        <div className="mockup-wrap">
          <div className="mockup-frame">
            <div className="mockup-titlebar">
              <div className="vault">
                <span className="vault-dot" />
                <span>MAIN VAULT</span>
              </div>
              <div className="status">
                <span className="net-dot" />
                LIVE
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-balance-label">TOTAL BALANCE</div>
              <div className="mockup-balance">
                1,240,000<span className="unit">QU</span>
              </div>
              <div className="mockup-account">
                <span className="name">PRIMARY</span>
                AAAAABBBB…CCCC
              </div>
              <div className="mockup-tick">TICK · 14,822,041</div>
              <div className="mockup-actions">
                <div className="mockup-btn primary">SEND</div>
                <div className="mockup-btn secondary">RECEIVE</div>
              </div>
              <div className="mockup-history-label">RECENT</div>
              <div className="mockup-tx">
                <div className="left">
                  <span className="kind">RECEIVED</span>
                  <span className="addr">AAAA…1234</span>
                </div>
                <span className="amt in">+50,000</span>
              </div>
              <div className="mockup-tx">
                <div className="left">
                  <span className="kind">SENT</span>
                  <span className="addr">BBBB…5678</span>
                </div>
                <span className="amt out">-10,000</span>
              </div>
              <div className="mockup-tx">
                <div className="left">
                  <span className="kind">PENDING</span>
                  <span className="addr">CCCC…9012</span>
                </div>
                <span className="amt pending">-5,000</span>
              </div>
            </div>
            <div className="mockup-tabbar">
              <div className="mockup-tab active">HOME</div>
              <div className="mockup-tab">SEND</div>
              <div className="mockup-tab">EARN</div>
              <div className="mockup-tab">APPS</div>
              <div className="mockup-tab">MORE</div>
            </div>
          </div>

          <div className="mockup-copy">
            <div className="section-eyebrow">[ 02.1 / DASHBOARD ]</div>
            <h3>Open it. See your balance. Done.</h3>
            <p>
              No banners. No onboarding popups. No "Welcome back!" energy.
              You open Sigil, see what you have, do what you came to do, and close it.
            </p>
            <ul className="mockup-bullets">
              <li>Your balance, big and clear</li>
              <li>Your account, ready to use</li>
              <li>Send and receive, one tap away</li>
              <li>Recent activity, plain English</li>
              <li>Privacy mode hides every number</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
