export function Security() {
  return (
    <div className="wrap">
      <section id="security">
        <div className="section-eyebrow">[ 04 / WHY YOU CAN TRUST IT ]</div>
        <h2 className="section-title">Nobody has ever seen your keys.</h2>
        <p className="section-sub">
          And nobody ever will — not us, not Apple, not Microsoft, not your ISP.
          Everything that matters happens on your computer, between you and Sigil.
        </p>

        <div className="features">
          <div className="feature">
            <span className="num">[ A ]</span>
            <h3 className="h">Your recovery phrase stays put</h3>
            <p className="b">When you set up a wallet, Sigil shows you a recovery phrase — then encrypts it on your computer. We can't see it. Nobody can.</p>
            <span className="tag">[ LOCAL ONLY ]</span>
          </div>
          <div className="feature">
            <span className="num">[ B ]</span>
            <h3 className="h">Your password isn't stored anywhere</h3>
            <p className="b">Even with Touch ID or Windows Hello, your password lives in your operating system's secure store — not in Sigil, not on disk.</p>
            <span className="tag">[ OS-MANAGED ]</span>
          </div>
          <div className="feature">
            <span className="num">[ C ]</span>
            <h3 className="h">It locks itself</h3>
            <p className="b">Walk away, sleep your laptop, switch windows — Sigil locks. You don't have to remember. Nothing you sign happens without you.</p>
            <span className="tag warn">[ AUTOMATIC ]</span>
          </div>
          <div className="feature">
            <span className="num">[ D ]</span>
            <h3 className="h">Updates are checked before they install</h3>
            <p className="b">Every update is signed. If something tampered with it on the way to you, Sigil refuses to install it. No surprises.</p>
            <span className="tag">[ VERIFIED ]</span>
          </div>
        </div>
      </section>
    </div>
  )
}
