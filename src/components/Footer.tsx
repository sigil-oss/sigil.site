export function Footer() {
  return (
    <div className="wrap">
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/favicon.svg" alt="Sigil" />
            <div className="name">SIGIL</div>
            <p>A wallet for QUBIC that stays on your computer. Free, open source, and built so nobody can see your keys but you.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#deeplink">Deep linking</a>
            <a href="#security">Security</a>
            <a href="#download">Download</a>
          </div>
          <div className="footer-col">
            <h4>Build</h4>
            <a href="https://github.com/sigil-oss/sigil.app" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://github.com/sigil-oss/sigil.app/releases" target="_blank" rel="noopener noreferrer">Changelog</a>
          </div>
          <div className="footer-col">
            <h4>Brand</h4>
            <a href="https://github.com/sigil-oss/sigil.app" target="_blank" rel="noopener noreferrer">Press kit</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SIGIL · BUILT FOR QUBIC</span>
          <span>OPEN SOURCE</span>
        </div>
      </footer>
    </div>
  )
}
