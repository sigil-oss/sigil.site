import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [
      { title: 'Sigil — Integration Docs' },
      { name: 'description', content: 'Integrate Sigil into your QUBIC app. Build the URI, open it, listen for the callback.' },
    ],
  }),
  component: DocsPage,
})

const NAV = [
  { section: '[ GETTING STARTED ]', links: [
    { id: 'intro',    label: 'Overview' },
    { id: 'protocol', label: 'The protocol' },
    { id: 'flow',     label: 'End-to-end flow' },
  ]},
  { section: '[ BUILDING THE REQUEST ]', links: [
    { id: 'payload',  label: 'Payload format' },
    { id: 'encoding', label: 'Encoding the URI' },
    { id: 'callback', label: 'Receiving the result' },
  ]},
  { section: '[ REQUEST TYPES ]', links: [
    { id: 'type-connect',  label: 'connect' },
    { id: 'type-transfer', label: 'transfer' },
    { id: 'type-sc-call',  label: 'sc_call' },
    { id: 'type-sign',     label: 'sign_message' },
    { id: 'type-verify',   label: 'verify_message' },
  ]},
  { section: '[ REFERENCE ]', links: [
    { id: 'errors', label: 'Validation & errors' },
    { id: 'full',   label: 'Full example' },
  ]},
]

function Sidebar({ activeId }: { activeId: string }) {
  return (
    <aside className="docs-aside">
      <Link to="/" className="docs-brand">
        <img src="/favicon.svg" alt="Sigil" />
        <div>
          <div className="docs-brand-name">SIGIL</div>
          <span className="docs-brand-sub">DOCS · v1</span>
        </div>
      </Link>
      <nav className="docs-nav">
        {NAV.map(({ section, links }) => (
          <div key={section}>
            <div className="docs-nav-section">{section}</div>
            {links.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className={activeId === id ? 'active' : ''}>{label}</a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

function DocsPage() {
  const activeId = useScrollSpy()

  return (
    <div className="docs-shell">
      <Sidebar activeId={activeId} />
      <main className="docs-main">
        <div className="docs-topbar">
          <span className="docs-topbar-label">SIGIL · INTEGRATION DOCS</span>
          <Link to="/">← Back to site</Link>
        </div>
        <div className="docs-content">

          <div id="intro" className="docs-eyebrow">[ DOCS · v1 · 2026 ]</div>
          <h1>Integrate <span className="doto">SIGIL</span><br/>in your app.</h1>
          <p>
            Sigil is a desktop wallet. Your frontend asks it to sign things over a{' '}
            <code className="inline">sigil://</code> URI. Sigil pops up, the user reviews
            and approves, then Sigil POSTs the signed result to a callback URL you
            control. That's the whole interface.
          </p>
          <p>
            No SDK is strictly required — the protocol is small enough to drop into
            any JavaScript, Python, or shell context. Build the URI, open it, listen
            for the callback.
          </p>

          <div className="callout info">
            <div className="callout-tag">[ SOURCE OF TRUTH ]</div>
            <p>Everything below is taken from the Rust validator at{' '}
            <code className="inline">src-tauri/src/deep_link.rs</code>. If the code
            and these docs disagree, the code wins.</p>
          </div>

          {/* Protocol */}
          <h2 id="protocol">The protocol</h2>
          <p>
            One URI, one callback. Sigil registers the <code className="inline">sigil://</code>{' '}
            scheme with the OS; opening such a URI brings Sigil to the foreground with your request.
          </p>
          <pre className="doc-pre"><span className="pre-label">URI SHAPE</span><span className="t-kw">sigil</span>://<span className="t-kw">v1</span>/<span className="t-kw">request</span>?<span className="t-key">d</span>={'<'}<span className="t-com">base64url-encoded JSON payload</span>{'>'}{'\n'}                   &amp;<span className="t-key">cb</span>={'<'}<span className="t-com">optional HTTPS callback URL</span>{'>'}</pre>
          <ul className="brief">
            <li>Scheme must be <code className="inline">sigil</code></li>
            <li>Host must be <code className="inline">v1</code> (version)</li>
            <li>Path must be <code className="inline">/request</code></li>
            <li>Query param <code className="inline">d</code> = base64url of your JSON payload (no padding)</li>
            <li>Query param <code className="inline">cb</code> = where Sigil POSTs the result (optional)</li>
          </ul>

          <h3 id="flow">End-to-end flow</h3>
          <ol style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>Build your JSON payload</strong> (a transfer, a contract call, a message to sign…) including a fresh <code className="inline">nonce</code> and your dapp identity.</li>
            <li><strong>Base64url-encode the JSON</strong> (no padding), put it in <code className="inline">?d=</code>.</li>
            <li><strong>Spin up a callback endpoint</strong> if you want a structured response, and put its HTTPS URL in <code className="inline">?cb=</code>.</li>
            <li><strong>Open the URI</strong> — <code className="inline">window.location.href = uri</code> in the browser.</li>
            <li><strong>Sigil validates</strong> the URI in Rust, focuses its window, shows your request.</li>
            <li><strong>User approves or rejects</strong>. Sigil POSTs JSON to your callback either way.</li>
          </ol>

          {/* Payload */}
          <h2 id="payload">Payload format</h2>
          <p>These fields are required on every request, regardless of type:</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td>One of <code className="inline">connect</code>, <code className="inline">transfer</code>, <code className="inline">sc_call</code>, <code className="inline">sign_message</code>, <code className="inline">verify_message</code></td></tr>
              <tr><td>nonce <span className="req">*</span></td><td>string</td><td>8–128 chars. Must be unique per request — Sigil rejects duplicates as replays</td></tr>
              <tr><td>dapp.origin <span className="req">*</span></td><td>string</td><td>Your origin, e.g. <code className="inline">https://yourapp.example</code>. Must be a valid URL</td></tr>
              <tr><td>dapp.name</td><td>string</td><td>Display name shown to the user. Recommended</td></tr>
              <tr><td>exp</td><td>integer</td><td>Unix seconds. If present and in the past, request is rejected</td></tr>
            </tbody>
          </table>

          <h3 id="encoding">Encoding the URI</h3>
          <p>Sigil expects <strong>URL-safe base64 without padding</strong> — the same flavor used by JWTs.</p>
          <pre className="doc-pre"><span className="pre-label">JAVASCRIPT</span><span className="t-kw">function</span> <span className="t-key">encodePayload</span>(payload) {'{'}
  <span className="t-kw">const</span> b64 = <span className="t-key">btoa</span>(<span className="t-key">JSON</span>.stringify(payload));
  <span className="t-com">// convert to base64url + strip padding</span>
  <span className="t-kw">return</span> b64.replaceAll(<span className="t-str">'+'</span>, <span className="t-str">'-'</span>)
            .replaceAll(<span className="t-str">'/'</span>, <span className="t-str">'_'</span>)
            .replaceAll(<span className="t-str">'='</span>, <span className="t-str">''</span>);
{'}'}

<span className="t-kw">function</span> <span className="t-key">buildSigilUri</span>(payload, callback) {'{'}
  <span className="t-kw">const</span> params = <span className="t-kw">new</span> <span className="t-key">URLSearchParams</span>({'{'}  d: <span className="t-key">encodePayload</span>(payload)  {'}'});
  <span className="t-kw">if</span> (callback) params.set(<span className="t-str">'cb'</span>, callback);
  <span className="t-kw">return</span> <span className="t-str">`sigil://v1/request?${'{'}params{'}'}`</span>;
{'}'}</pre>

          {/* Callback */}
          <h2 id="callback">Receiving the result</h2>
          <p>Sigil makes an HTTP <code className="inline">POST</code> with a JSON body to your <code className="inline">cb</code> URL.</p>
          <h3>Constraints on <code className="inline">cb</code></h3>
          <ul className="brief">
            <li>Must be <code className="inline">https://</code> in production</li>
            <li><code className="inline">http://localhost</code> and <code className="inline">http://127.0.0.1</code> are allowed for local dev</li>
          </ul>
          <h3>If the user rejects</h3>
          <pre className="doc-pre"><span className="pre-label">POST {'<'}your cb URL{'>'}</span>{'{'}{'\n'}  <span className="t-key">"status"</span>: <span className="t-str">"rejected"</span>,{'\n'}  <span className="t-key">"nonce"</span>: <span className="t-str">"{'<'}the nonce you sent{'>'}"</span>,{'\n'}  <span className="t-key">"type"</span>: <span className="t-str">"{'<'}original request type{'>'}"</span>,{'\n'}  <span className="t-key">"reason"</span>: <span className="t-str">"user_rejected"</span>{'\n'}{'}'}</pre>
          <div className="callout warn">
            <div className="callout-tag">[ ALWAYS VERIFY THE NONCE ]</div>
            <p>Match the <code className="inline">nonce</code> on the callback against the one you sent. Don't trust the body until that matches.</p>
          </div>

          {/* connect */}
          <h2 id="type-connect">connect</h2>
          <p>Ask the user to pair their wallet with your app and optionally pre-grant permissions.</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td><code className="inline">"connect"</code></td></tr>
              <tr><td>permissions</td><td>string[]</td><td>Any subset of <code className="inline">"transfer"</code>, <code className="inline">"sc_call"</code>, <code className="inline">"sign_message"</code></td></tr>
            </tbody>
          </table>
          <pre className="doc-pre"><span className="pre-label">REQUEST PAYLOAD</span>{'{'}{'\n'}  <span className="t-key">"type"</span>: <span className="t-str">"connect"</span>,{'\n'}  <span className="t-key">"nonce"</span>: <span className="t-str">"a1b2c3d4e5f6g7h8"</span>,{'\n'}  <span className="t-key">"dapp"</span>: {'{'} <span className="t-key">"name"</span>: <span className="t-str">"Acme"</span>, <span className="t-key">"origin"</span>: <span className="t-str">"https://acme.example"</span> {'}'},{'\n'}  <span className="t-key">"permissions"</span>: [<span className="t-str">"transfer"</span>, <span className="t-str">"sign_message"</span>]{'\n'}{'}'}</pre>

          {/* transfer */}
          <h2 id="type-transfer">transfer</h2>
          <p>Send an amount of QU from the user's selected account to a recipient.</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td><code className="inline">"transfer"</code></td></tr>
              <tr><td>to <span className="req">*</span></td><td>string</td><td>Exactly 60 uppercase A–Z letters (Qubic identity format)</td></tr>
              <tr><td>amount <span className="req">*</span></td><td>integer</td><td>Positive. Whole QU units</td></tr>
            </tbody>
          </table>
          <pre className="doc-pre"><span className="pre-label">REQUEST PAYLOAD</span>{'{'}{'\n'}  <span className="t-key">"type"</span>: <span className="t-str">"transfer"</span>,{'\n'}  <span className="t-key">"nonce"</span>: <span className="t-str">"f3a8b2c1..."</span>,{'\n'}  <span className="t-key">"dapp"</span>: {'{'} <span className="t-key">"name"</span>: <span className="t-str">"Acme"</span>, <span className="t-key">"origin"</span>: <span className="t-str">"https://acme.example"</span> {'}'},{'\n'}  <span className="t-key">"to"</span>: <span className="t-str">"NQZBXKZP4MTLD...UVWXYZK8MF"</span>,{'\n'}  <span className="t-key">"amount"</span>: <span className="t-num">1500000</span>{'\n'}{'}'}</pre>

          {/* sc_call */}
          <h2 id="type-sc-call">sc_call</h2>
          <p>Call a Qubic smart contract function. Sigil constructs the SC invocation transaction and signs it.</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td><code className="inline">"sc_call"</code></td></tr>
              <tr><td>contract_index <span className="req">*</span></td><td>integer</td><td>0–63</td></tr>
              <tr><td>input_type <span className="req">*</span></td><td>integer</td><td>Non-negative. The procedure number on the contract</td></tr>
              <tr><td>input</td><td>string</td><td>Base64-encoded input bytes (if the procedure takes input)</td></tr>
              <tr><td>amount</td><td>integer</td><td>QU attached to the call, if any</td></tr>
            </tbody>
          </table>

          {/* sign_message */}
          <h2 id="type-sign">sign_message</h2>
          <p>Ask the user to sign a message without sending a transaction. Useful for proving address ownership.</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td><code className="inline">"sign_message"</code></td></tr>
              <tr><td>message <span className="req">*</span></td><td>string</td><td>Non-empty. Shown verbatim to the user before they sign</td></tr>
            </tbody>
          </table>
          <pre className="doc-pre"><span className="pre-label">APPROVE CALLBACK</span>{'{'}{'\n'}  <span className="t-key">"status"</span>: <span className="t-str">"signed"</span>,{'\n'}  <span className="t-key">"identity"</span>: <span className="t-str">"{'<'}signing identity{'>'}"</span>,{'\n'}  <span className="t-key">"signature"</span>: <span className="t-str">"{'<'}signature bytes, base64{'>'}"</span>,{'\n'}  <span className="t-key">"public_key"</span>: <span className="t-str">"{'<'}public key, base64{'>'}"</span>{'\n'}{'}'}</pre>

          {/* verify_message */}
          <h2 id="type-verify">verify_message</h2>
          <p>Hand Sigil a message + signature + public key, get back whether the signature is valid.</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td><code className="inline">"verify_message"</code></td></tr>
              <tr><td>message <span className="req">*</span></td><td>string</td><td>The original message that was signed</td></tr>
              <tr><td>signature <span className="req">*</span></td><td>string</td><td>The signature to verify</td></tr>
              <tr><td>public_key <span className="req">*</span></td><td>string</td><td>The public key to verify against</td></tr>
            </tbody>
          </table>

          {/* Validation */}
          <h2 id="errors">Validation & errors</h2>
          <p>Sigil validates every URI in Rust <em>before</em> the renderer sees it. Failures are dropped silently — check Sigil's stderr if your popup doesn't appear.</p>
          <h3>What Sigil rejects up front</h3>
          <ul className="brief">
            <li>Scheme isn't <code className="inline">sigil</code> or host isn't <code className="inline">v1</code></li>
            <li>Missing <code className="inline">d</code> parameter or invalid base64url</li>
            <li>Missing <code className="inline">type</code>, <code className="inline">nonce</code>, or <code className="inline">dapp.origin</code></li>
            <li>Unknown <code className="inline">type</code> or nonce outside 8–128 chars</li>
            <li><code className="inline">exp</code> is set and already in the past</li>
            <li><code className="inline">cb</code> isn't HTTPS (except localhost/127.0.0.1)</li>
            <li>Nonce was used before (replay protection)</li>
            <li>Type-specific validation fails</li>
          </ul>

          {/* Full example */}
          <h2 id="full">Full working example</h2>
          <p>Plain HTML page that asks Sigil to sign a login message.</p>
          <pre className="doc-pre"><span className="pre-label">CLIENT</span>{`document.getElementById('signin').addEventListener('click', () => {
  const payload = {
    type: 'sign_message',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: window.location.origin },
    message: \`Sign in to Acme · \${new Date().toISOString()}\`,
    exp: Math.floor(Date.now() / 1000) + 300,
  };
  const d = btoa(JSON.stringify(payload))
    .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  window.location.href = \`sigil://v1/request?d=\${d}&cb=\${
    encodeURIComponent('https://acme.example/sigil/callback')
  }\`;
});`}</pre>

          <div className="callout info">
            <div className="callout-tag">[ NEXT STEPS ]</div>
            <p>Open the Sigil <code className="inline">deep_link.rs</code> source for the exact validator, or read the request screen TSX to see how each callback body is built. Both are browseable in the{' '}
            <a className="doc-link" href="https://github.com/sigil-oss/sigil.app" target="_blank" rel="noopener noreferrer">GitHub repo</a>.</p>
          </div>

        </div>
      </main>
    </div>
  )
}

function useScrollSpy(): string {
  const activeId = useRef('')
  useEffect(() => {
    const ids = NAV.flatMap(g => g.links.map(l => l.id))
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    const update = () => {
      const scrollY = window.scrollY + 120
      let current = ids[0]
      for (const el of els) {
        if (el.offsetTop <= scrollY) current = el.id
      }
      if (activeId.current !== current) {
        activeId.current = current
        document.querySelectorAll('.docs-nav a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${current}`)
        })
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return activeId.current
}
