import { Link } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'

export function Nav() {
  const posthog = usePostHog()

  const track = (section: string) => posthog.capture('nav_link_clicked', { section })

  return (
    <nav>
      <div className="nav-inner">
        <Link className="nav-brand" to="/">
          <img src="/favicon.svg" alt="Sigil" />
          <span className="name">SIGIL</span>
        </Link>
        <div className="nav-links">
          <a href="/#features" onClick={() => track('features')}>Features</a>
          <a href="/#deeplink" onClick={() => track('apps')}>Apps</a>
          <a href="/#security" onClick={() => track('security')}>Trust</a>
          <Link to="/docs" onClick={() => track('docs')}>Docs</Link>
          <Link to="/brand" onClick={() => track('brand')}>Brand</Link>
          <a href="/#download" className="cta" onClick={() => track('download')}>Download</a>
        </div>
      </div>
    </nav>
  )
}
