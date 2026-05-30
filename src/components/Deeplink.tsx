export function Deeplink() {
  return (
    <div className="wrap">
      <section id="deeplink">
        <div className="section-eyebrow">[ 03 / CONNECT TO APPS ]</div>
        <h2 className="section-title">Any QUBIC app can ask.<br/>You always decide.</h2>
        <p className="section-sub">
          Use a QUBIC web app, a CLI tool, or a game — anything that wants you to
          sign a transaction can ask Sigil. You see what they want before anything
          happens. No surprise signatures.
        </p>

        <div className="deeplink-bar">
          <span className="label">EXAMPLE</span>
          <span className="uri">
            <span className="scheme">sigil://</span>sign…
            <span className="query">  (an app asking you to sign something)</span>
          </span>
        </div>

        <div className="deeplink-flow">
          <div className="deeplink-step">
            <div className="num">01</div>
            <div className="h">[ THE ASK ]</div>
            <p className="b">An app wants you to sign — a payment, a message, a contract call. It tells Sigil what it wants.</p>
          </div>
          <div className="deeplink-step">
            <div className="num">02</div>
            <div className="h">[ SIGIL POPS UP ]</div>
            <p className="b">Sigil opens and shows you the full request. If your wallet is locked, you unlock it first.</p>
          </div>
          <div className="deeplink-step">
            <div className="num">03</div>
            <div className="h">[ YOU READ IT ]</div>
            <p className="b">See the app's name, what it's signing, how much, and which account. <span style={{ color: 'var(--warning)' }}>[ FIRST TIME ]</span> tag warns on apps you haven't used before.</p>
          </div>
          <div className="deeplink-step">
            <div className="num">04</div>
            <div className="h">[ YOU DECIDE ]</div>
            <p className="b">Approve, and Sigil signs and sends. Reject, and the app gets a polite "no." That's the whole flow.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
