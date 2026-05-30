const GITHUB = 'https://github.com/sigil-oss/sigil.app/releases/latest'

export function Download() {
  return (
    <div className="wrap">
      <section id="download">
        <div className="section-eyebrow">[ 05 / GET IT ]</div>
        <h2 className="section-title">Pick your computer.</h2>
        <p className="section-sub">
          One file, one install. Updates show up in the wallet when they're ready —
          you click, it installs, it reopens. That's it.
        </p>

        <div className="features">
          <div className="feature">
            <span className="num">[ ⌘ ]</span>
            <h3 className="h">Mac</h3>
            <p className="b">Works on Apple Silicon and Intel. Drag the icon into Applications and open it.</p>
            <a className="btn primary" href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              <span>Sigil.dmg</span>
              <span className="arrow">↓</span>
            </a>
          </div>
          <div className="feature">
            <span className="num">[ ⊞ ]</span>
            <h3 className="h">Windows</h3>
            <p className="b">Windows 10 or newer. Run the installer; it handles everything it needs.</p>
            <a className="btn primary" href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              <span>Sigil.exe</span>
              <span className="arrow">↓</span>
            </a>
          </div>
          <div className="feature">
            <span className="num">[ ⌂ ]</span>
            <h3 className="h">Linux</h3>
            <p className="b">AppImage runs anywhere. Or grab the .deb for Debian/Ubuntu, or .rpm for Fedora/RHEL.</p>
            <a className="btn primary" href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              <span>Sigil.AppImage</span>
              <span className="arrow">↓</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
