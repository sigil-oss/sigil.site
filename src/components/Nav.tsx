import { usePostHog } from '@posthog/react'

export function Nav() {
  const posthog = usePostHog()

  const handleNavClick = (section: string) => {
    posthog.capture('nav_link_clicked', { section })
  }

  return (
    <nav>
      <div className="nav-inner">
        <a className="nav-brand" href="#">
          <img src="/favicon.svg" alt="Sigil" />
          <span className="name">SIGIL</span>
        </a>
        <div className="nav-links">
          <a href="#features" onClick={() => handleNavClick('features')}>Features</a>
          <a href="#deeplink" onClick={() => handleNavClick('apps')}>Apps</a>
          <a href="#security" onClick={() => handleNavClick('security')}>Trust</a>
          <a href="#download" className="cta" onClick={() => handleNavClick('download')}>Download</a>
        </div>
      </div>
    </nav>
  )
}
