export function Nav() {
  return (
    <nav>
      <div className="nav-inner">
        <a className="nav-brand" href="#">
          <img src="/favicon.svg" alt="Sigil" />
          <span className="name">SIGIL</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#deeplink">Apps</a>
          <a href="#security">Trust</a>
          <a href="#download" className="cta">Download</a>
        </div>
      </div>
    </nav>
  )
}
