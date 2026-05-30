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
  { section: '[ @SIGIL-OSS/CONNECT ]', links: [
    { id: 'sdk',            label: 'Overview & install' },
    { id: 'sdk-unsigned',   label: 'Unsigned requests' },
    { id: 'sdk-signed',     label: 'Signed requests' },
    { id: 'sdk-callbacks',  label: 'Parsing callbacks' },
  ]},
  { section: '[ REFERENCE ]', links: [
    { id: 'cb-shapes',  label: 'Callback shapes' },
    { id: 'errors',     label: 'Validation & errors' },
    { id: 'full',       label: 'Full example' },
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
            The quickest path is the official{' '}
            <a className="doc-link" href="https://github.com/sigil-oss/sigil.connect" target="_blank" rel="noopener noreferrer">@sigil-oss/connect</a>{' '}
            SDK — it builds envelopes, signs them, and parses callback responses. Or build the URI yourself: the protocol is small enough to drop into any JS, Python, or shell context.
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
          <pre className="doc-pre"><span className="pre-label">URI SHAPE</span><span className="t-kw">sigil</span>://<span className="t-kw">v1</span>/<span className="t-kw">request</span>?<span className="t-key">d</span>={'<'}<span className="t-com">base64url-encoded JSON envelope</span>{'>'}{'\n'}                   [&amp;<span className="t-key">cb</span>={'<'}<span className="t-com">optional HTTPS callback URL</span>{'>'}]</pre>
          <ul className="brief">
            <li>Scheme must be <code className="inline">sigil</code></li>
            <li>Host must be <code className="inline">v1</code>, path must be <code className="inline">/request</code></li>
            <li><code className="inline">d</code> = base64url (no padding) of a JSON envelope: <code className="inline">{'{ request, callback?, proof? }'}</code></li>
            <li>Callback can be set in the envelope's <code className="inline">callback</code> field or via the <code className="inline">&amp;cb=</code> query param — if both are present they must match</li>
            <li>Envelope max size: 8 192 bytes (base64)</li>
          </ul>

          <h3 id="flow">End-to-end flow</h3>
          <ol style={{ paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>Build your JSON envelope</strong>: <code className="inline">{'{ request: { type, nonce, dapp, ...fields }, callback? }'}</code></li>
            <li><strong>Base64url-encode the envelope</strong> (no padding) and put it in <code className="inline">?d=</code>.</li>
            <li><strong>Spin up a callback endpoint</strong> if you want a structured response — put its HTTPS URL in the envelope's <code className="inline">callback</code> field.</li>
            <li><strong>Open the URI</strong> — <code className="inline">window.location.href = uri</code> in the browser, <code className="inline">open</code>/<code className="inline">xdg-open</code>/<code className="inline">start</code> from a native app.</li>
            <li><strong>Sigil validates</strong> the URI in Rust, focuses its window, queues the request.</li>
            <li><strong>User approves or rejects</strong>. Sigil POSTs the result to your callback from the Rust layer.</li>
          </ol>

          {/* Payload */}
          <h2 id="payload">Payload format</h2>
          <p>The <code className="inline">d</code> parameter encodes a JSON envelope. The <code className="inline">request</code> object inside it contains these required fields on every request type:</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td>One of <code className="inline">connect</code>, <code className="inline">transfer</code>, <code className="inline">sc_call</code>, <code className="inline">sign_message</code>, <code className="inline">verify_message</code></td></tr>
              <tr><td>nonce <span className="req">*</span></td><td>string</td><td>16–128 chars, alphanumeric or <code className="inline">-_=+</code>. Must be unique — Sigil tracks seen nonces for 1 hour and rejects replays</td></tr>
              <tr><td>dapp.origin <span className="req">*</span></td><td>string</td><td>Must be a valid <strong>HTTPS</strong> URL, e.g. <code className="inline">https://yourapp.example</code></td></tr>
              <tr><td>dapp.name</td><td>string</td><td>Display name shown to the user. Strongly recommended</td></tr>
              <tr><td>dapp.icon</td><td>string</td><td>URL to the dApp's icon. Optional</td></tr>
              <tr><td>exp</td><td>integer</td><td>Unix seconds. Defaults to 5 minutes from receipt if omitted. Max 1 hour from now — requests further out are rejected</td></tr>
            </tbody>
          </table>

          <h3 id="encoding">Encoding the URI</h3>
          <p>Encode the <strong>envelope</strong> (not just the request) with <strong>URL-safe base64 without padding</strong>.</p>
          <pre className="doc-pre"><span className="pre-label">JAVASCRIPT</span><span className="t-kw">function</span> <span className="t-key">b64url</span>(str) {'{'}
  <span className="t-kw">return</span> <span className="t-key">btoa</span>(str)
    .replaceAll(<span className="t-str">'+'</span>, <span className="t-str">'-'</span>)
    .replaceAll(<span className="t-str">'/'</span>, <span className="t-str">'_'</span>)
    .replaceAll(<span className="t-str">'='</span>, <span className="t-str">''</span>);
{'}'}

<span className="t-kw">function</span> <span className="t-key">buildSigilUri</span>(request, callback) {'{'}
  <span className="t-com">// Wrap request in the envelope — callback lives here, not as a query param</span>
  <span className="t-kw">const</span> envelope = {'{'} request, callback: callback ?? <span className="t-kw">null</span> {'}'};
  <span className="t-kw">const</span> d = <span className="t-key">b64url</span>(<span className="t-key">JSON</span>.stringify(envelope));
  <span className="t-kw">return</span> <span className="t-str">`sigil://v1/request?d=${'{'}d{'}'}`</span>;
{'}'}</pre>

          {/* Trust */}
          <div className="callout info" style={{ marginTop: 32 }}>
            <div className="callout-tag">[ TRUST LEVELS ]</div>
            <p>Requests can be unsigned (<code className="inline">legacy_unverified</code> — metadata is self-reported) or carry an ES256 <code className="inline">proof</code> signed by a registered dApp issuer. If a proof is present but the signature is invalid, or the issuer is in the registry but the origin doesn't match, <strong>Sigil blocks approval</strong>. Unsigned requests can still be reviewed and approved — the UI shows the trust level clearly. Use <a className="doc-link" href="https://github.com/sigil-oss/sigil.connect" target="_blank" rel="noopener noreferrer">@sigil-oss/connect</a> to sign envelopes.</p>
          </div>

          {/* Callback */}
          <h2 id="callback">Receiving the result</h2>
          <p>Sigil makes an HTTP <code className="inline">POST</code> with a JSON body to your callback URL from the Rust layer. If delivery fails, the result stays recoverable in request history for retry.</p>
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
              <tr><td>payload</td><td>string</td><td>Base64-encoded input bytes for the call (if the procedure takes input)</td></tr>
              <tr><td>amount</td><td>integer</td><td>QU attached to the call, if any</td></tr>
              <tr><td>from</td><td>string</td><td>Prefer a specific account identity. Optional — user can override</td></tr>
            </tbody>
          </table>

          {/* sign_message */}
          <h2 id="type-sign">sign_message</h2>
          <p>Ask the user to sign a message without sending a transaction. Useful for proving address ownership.</p>
          <table className="fields">
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>type <span className="req">*</span></td><td>string</td><td><code className="inline">"sign_message"</code></td></tr>
              <tr><td>message <span className="req">*</span></td><td>string</td><td>Non-empty, max 2 048 characters. Shown verbatim to the user</td></tr>
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

          {/* ── @sigil-oss/connect ───────────────────────────────────────── */}
          <h2 id="sdk">@sigil-oss/connect</h2>
          <p>
            The official SDK handles envelope construction, ES256 signing, and callback parsing so you don't
            wire up base64url encoding and canonicalization yourself.
          </p>
          <pre className="doc-pre"><span className="pre-label">INSTALL</span>{`npm install @sigil-oss/connect
# or
bun add @sigil-oss/connect`}</pre>
          <p>
            Source and changelog: <a className="doc-link" href="https://github.com/sigil-oss/sigil.connect" target="_blank" rel="noopener noreferrer">github.com/sigil-oss/sigil.connect</a>.
            The package re-exports the same Zod schema that Sigil's renderer uses, so a request that parses
            in the SDK is guaranteed to parse inside the wallet.
          </p>

          <h2 id="sdk-unsigned">Unsigned requests</h2>
          <p>
            Unsigned requests show a <strong>trust level of "unverified"</strong> in the wallet UI — the dApp name
            and origin are self-reported and can't be verified. Use them for prototyping or internal tooling
            where trust is established by other means.
          </p>
          <pre className="doc-pre"><span className="pre-label">TRANSFER</span>{`import { buildSigilUri } from '@sigil-oss/connect'

const uri = buildSigilUri({
  request: {
    type: 'transfer',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    to: 'RECIPIENT60CHARIDENTITYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    amount: 1_500_000,
    // optional: from, tick_offset
  },
  callback: 'https://acme.example/sigil/callback',
})
window.location.href = uri`}</pre>
          <pre className="doc-pre"><span className="pre-label">SIGN MESSAGE</span>{`const uri = buildSigilUri({
  request: {
    type: 'sign_message',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: 'https://acme.example', icon: 'https://acme.example/logo.png' },
    message: \`Sign in to Acme · \${new Date().toISOString()}\`,
    exp: Math.floor(Date.now() / 1000) + 300,  // 5 min, max 1 hour
    // optional: from, data
  },
  callback: 'https://acme.example/sigil/callback',
})`}</pre>
          <pre className="doc-pre"><span className="pre-label">CONNECT (REQUEST PERMISSIONS)</span>{`const uri = buildSigilUri({
  request: {
    type: 'connect',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    permissions: ['transfer', 'sign_message'],  // or omit to ask for nothing pre-approved
  },
  callback: 'https://acme.example/sigil/callback',
})`}</pre>
          <pre className="doc-pre"><span className="pre-label">SC CALL (QEARN LOCK EXAMPLE)</span>{`const uri = buildSigilUri({
  request: {
    type: 'sc_call',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    contract_index: 6,     // Qearn
    input_type: 1,         // lock procedure
    amount: 10_000_000,
    // optional: payload (base64 encoded input bytes), from, tick_offset
  },
  callback: 'https://acme.example/sigil/callback',
})`}</pre>

          <h2 id="sdk-signed">Signed requests</h2>
          <p>
            Signed requests include an ES256 <code className="inline">proof</code> that lets Sigil verify the request
            came from your registered dApp identity. The wallet evaluates each request against a local trusted
            issuer registry and surfaces one of these trust levels:
          </p>
          <table className="fields">
            <thead><tr><th>Level</th><th>Meaning</th><th>Blocks approval?</th></tr></thead>
            <tbody>
              <tr><td><code className="inline">legacy_unverified</code></td><td>No proof present — dApp name/origin are self-reported</td><td>No</td></tr>
              <tr><td><code className="inline">signed_untrusted</code></td><td>Valid ES256 signature, but issuer not in the user's local registry</td><td>No</td></tr>
              <tr><td><code className="inline">verified_registry</code></td><td>Valid signature, issuer in registry, origin matches</td><td>No</td></tr>
              <tr><td><code className="inline">signature_invalid</code></td><td>Proof present but signature verification failed, or payload hash mismatch</td><td>Yes</td></tr>
              <tr><td><code className="inline">registry_revoked</code></td><td>Issuer is in the registry but marked revoked</td><td>Yes</td></tr>
              <tr><td><code className="inline">registry_origin_mismatch</code></td><td>Issuer is registered but <code className="inline">dapp.origin</code> doesn't match its trusted origins</td><td>Yes</td></tr>
            </tbody>
          </table>

          <h3>How the proof is computed</h3>
          <p>
            The SDK handles this, but here's what happens under the hood so you can audit it or implement
            it without the SDK:
          </p>
          <ul className="brief">
            <li><strong>Canonical payload</strong> = deterministic JSON of <code className="inline">{'{ request, callback }'}</code> with keys sorted recursively</li>
            <li><strong>payload_hash</strong> = SHA-256 of the canonical payload, base64url-encoded (no padding)</li>
            <li><strong>signature</strong> = ECDSA P-256 + SHA-256 (<code className="inline">SubtleCrypto</code> <code className="inline">ES256</code>) over the canonical payload, base64url-encoded</li>
            <li>Include <code className="inline">public_jwk</code> for self-verifying proofs; omit it to rely on registry lookup only</li>
          </ul>

          <pre className="doc-pre"><span className="pre-label">SIGNED REQUEST (SDK)</span>{`import { buildSigilUri, signEnvelope } from '@sigil-oss/connect'

// Generate once and register the public key with your issuer entry.
// Keep privateKey secure — never expose it to the browser.
const { privateKey, publicKey } = await crypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  true,   // extractable — needed to export the JWK for registration
  ['sign', 'verify'],
)

const envelope = {
  request: {
    type: 'sign_message',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    message: \`Sign in · \${new Date().toISOString()}\`,
    exp: Math.floor(Date.now() / 1000) + 300,
  },
  callback: 'https://acme.example/sigil/callback',
}

// signEnvelope adds the proof object and returns a new envelope
const signed = await signEnvelope(envelope, {
  issuer: 'https://acme.example',     // stable identifier for your dApp
  privateKey,                          // CryptoKey — never leaves server
  keyId: 'key-2026-01',               // optional — useful for key rotation
  includePublicJwk: true,             // embed public key for self-verifying proofs
})

window.location.href = buildSigilUri(signed)`}</pre>

          <div className="callout warn">
            <div className="callout-tag">[ SIGN ON THE SERVER, NOT IN THE BROWSER ]</div>
            <p>
              The ES256 private key must never be exposed to the browser. Build the signed envelope on your
              server and return the final <code className="inline">sigil://</code> URI (or just the <code className="inline">d=</code> parameter)
              to the client. The client only opens it.
            </p>
          </div>

          <pre className="doc-pre"><span className="pre-label">SERVER-SIDE SIGNING (NODE / EXPRESS)</span>{`import { buildSigilUri, signEnvelope, loadPrivateKey } from '@sigil-oss/connect/node'
import express from 'express'

const app = express()
// Load your ECDSA P-256 private key from a secret store (env var, Vault, KMS, etc.)
const privateKey = await loadPrivateKey(process.env.SIGIL_SIGNING_KEY)

app.post('/api/sigil/prepare', async (req, res) => {
  const { action, payload } = req.body

  const envelope = {
    request: {
      type: action,
      nonce: crypto.randomUUID(),
      dapp: { name: 'Acme', origin: 'https://acme.example' },
      ...payload,
    },
    callback: 'https://acme.example/sigil/callback',
  }

  const signed = await signEnvelope(envelope, {
    issuer: 'https://acme.example',
    privateKey,
    keyId: 'key-2026-01',
  })

  res.json({ uri: buildSigilUri(signed) })
})`}</pre>

          <h2 id="sdk-callbacks">Parsing callbacks</h2>
          <p>
            Sigil POSTs a JSON body to your callback URL from its Rust layer. The SDK's <code className="inline">parseSigilCallback</code>{' '}
            validates the shape and returns a discriminated union you can switch on.
          </p>
          <pre className="doc-pre"><span className="pre-label">NODE / EXPRESS CALLBACK HANDLER</span>{`import { parseSigilCallback } from '@sigil-oss/connect'
import express from 'express'

const app = express()
app.use(express.json())

const pending = new Map()  // nonce → { userId, expectedAction }

app.post('/sigil/callback', (req, res) => {
  const result = parseSigilCallback(req.body)
  if (!result.ok) return res.status(400).json({ error: result.error })

  const { status, nonce, type } = result.data

  // Always verify the nonce matches what you sent
  const session = pending.get(nonce)
  if (!session) return res.status(404).send('unknown nonce')
  pending.delete(nonce)  // single-use

  if (status === 'rejected') {
    console.log('user rejected:', result.data.reason)
    return res.sendStatus(200)
  }

  switch (type) {
    case 'transfer':
    case 'sc_call': {
      // result.data: { status: 'signed', identity, tx_hash, target_tick }
      console.log('tx broadcast:', result.data.tx_hash, 'tick:', result.data.target_tick)
      break
    }
    case 'sign_message': {
      // result.data: { status: 'signed', identity, signature, public_key }
      // Verify the signature yourself if needed — or send a verify_message request back
      markLoggedIn(session.userId, result.data.identity)
      break
    }
    case 'verify_message': {
      // result.data: { status: 'verified', valid: boolean, identity }
      console.log('signature valid:', result.data.valid)
      break
    }
    case 'connect': {
      // result.data: { status: 'connected', identity, permissions: string[] }
      saveWalletSession(session.userId, result.data.identity, result.data.permissions)
      break
    }
  }

  res.sendStatus(200)
})`}</pre>

          {/* Callback shapes */}
          <h2 id="cb-shapes">Callback shapes</h2>
          <p>All callbacks include <code className="inline">status</code>, <code className="inline">nonce</code>, and <code className="inline">type</code>. The remaining fields depend on the outcome.</p>

          <h3>transfer / sc_call — approved</h3>
          <pre className="doc-pre">{`{
  "status":      "signed",
  "type":        "transfer" | "sc_call",
  "nonce":       "<nonce you sent>",
  "identity":    "<60-char Qubic identity that signed>",
  "tx_hash":     "<transaction hash>",
  "target_tick": 14872123
}`}</pre>

          <h3>sign_message — approved</h3>
          <pre className="doc-pre">{`{
  "status":     "signed",
  "type":       "sign_message",
  "nonce":      "<nonce you sent>",
  "identity":   "<60-char Qubic identity>",
  "signature":  "<ECDSA signature, base64>",
  "public_key": "<public key, base64>"
}`}</pre>

          <h3>verify_message — complete</h3>
          <pre className="doc-pre">{`{
  "status":   "verified",
  "type":     "verify_message",
  "nonce":    "<nonce you sent>",
  "valid":    true | false,
  "identity": "<derived identity, or empty string>"
}`}</pre>

          <h3>connect — approved</h3>
          <pre className="doc-pre">{`{
  "status":      "connected",
  "type":        "connect",
  "nonce":       "<nonce you sent>",
  "identity":    "<60-char Qubic identity>",
  "permissions": ["transfer", "sign_message"]  // whatever the user granted
}`}</pre>

          <h3>Any type — rejected</h3>
          <pre className="doc-pre">{`{
  "status": "rejected",
  "type":   "<original request type>",
  "nonce":  "<nonce you sent>",
  "reason": "user_rejected"
}`}</pre>

          <div className="callout info">
            <div className="callout-tag">[ TYPESCRIPT TYPES ]</div>
            <p>
              <code className="inline">@sigil-oss/connect</code> re-exports{' '}
              <code className="inline">SigilCallbackResponse</code>,{' '}
              <code className="inline">SigilSignedTransferCallback</code>,{' '}
              <code className="inline">SigilSignedMessageCallback</code>,{' '}
              <code className="inline">SigilConnectedCallback</code>,{' '}
              <code className="inline">SigilVerifiedCallback</code>, and{' '}
              <code className="inline">SigilRejectedCallback</code> — all derived from the same Zod schema Sigil uses internally.
            </p>
          </div>

          {/* Validation */}
          <h2 id="errors">Validation & errors</h2>
          <p>Sigil validates every URI in Rust <em>before</em> the renderer sees it. Failures are logged to stderr and the request is silently dropped — no popup will appear. Check stderr if debugging.</p>
          <h3>What Sigil rejects up front</h3>
          <ul className="brief">
            <li>Scheme isn't <code className="inline">sigil</code> or host isn't <code className="inline">v1</code></li>
            <li>Missing <code className="inline">d</code> parameter, payload over 8 192 bytes, or invalid base64url</li>
            <li>Missing <code className="inline">type</code>, <code className="inline">nonce</code>, or <code className="inline">dapp.origin</code></li>
            <li>Unknown <code className="inline">type</code>, or nonce outside 16–128 chars or invalid charset</li>
            <li><code className="inline">dapp.origin</code> scheme isn't <code className="inline">https</code></li>
            <li><code className="inline">exp</code> is in the past, or more than 1 hour from now</li>
            <li>Callback isn't HTTPS (except <code className="inline">http://localhost</code> / <code className="inline">http://127.0.0.1</code> for local dev)</li>
            <li>Callback targets a private or loopback address (other than localhost)</li>
            <li>Nonce was used before (replay protection — 1-hour window, persisted to disk)</li>
            <li>Type-specific validation fails (invalid identity format, non-positive amount, etc.)</li>
          </ul>

          {/* Full example */}
          <h2 id="full">Full working example</h2>
          <p>Minimal login flow: client builds a signed envelope on the server and opens it; server verifies the nonce on callback.</p>
          <pre className="doc-pre"><span className="pre-label">SERVER — prepare endpoint</span>{`// POST /api/sigil/prepare → { uri }
app.post('/api/sigil/prepare', async (req, res) => {
  const nonce = crypto.randomUUID()
  pending.set(nonce, { userId: req.session.userId })

  const signed = await signEnvelope({
    request: {
      type: 'sign_message',
      nonce,
      dapp: { name: 'Acme', origin: 'https://acme.example' },
      message: \`Sign in to Acme · \${new Date().toISOString()}\`,
      exp: Math.floor(Date.now() / 1000) + 300,
    },
    callback: 'https://acme.example/sigil/callback',
  }, { issuer: 'https://acme.example', privateKey, keyId: 'key-2026-01' })

  res.json({ uri: buildSigilUri(signed) })
})`}</pre>
          <pre className="doc-pre"><span className="pre-label">CLIENT — open Sigil</span>{`const { uri } = await fetch('/api/sigil/prepare', { method: 'POST' }).then(r => r.json())
window.location.href = uri   // OS hands it to Sigil`}</pre>
          <pre className="doc-pre"><span className="pre-label">SERVER — callback handler</span>{`app.post('/sigil/callback', (req, res) => {
  const result = parseSigilCallback(req.body)
  if (!result.ok) return res.sendStatus(400)

  const { status, nonce, type } = result.data
  const session = pending.get(nonce)
  if (!session) return res.sendStatus(404)
  pending.delete(nonce)

  if (status === 'rejected') return res.sendStatus(200)

  if (status === 'signed' && type === 'sign_message') {
    markLoggedIn(session.userId, result.data.identity)
    // optionally: issue a signed verify_message request to double-check the signature
  }
  res.sendStatus(200)
})`}</pre>

          <div className="callout info">
            <div className="callout-tag">[ SOURCE ]</div>
            <p>
              Rust validator: <code className="inline">src-tauri/src/deep_link.rs</code> ·{' '}
              Zod schema + callback types: <code className="inline">src/lib/request-schema.ts</code> ·{' '}
              Trust evaluation: <code className="inline">src/lib/request-trust.ts</code>{' '}—{' '}
              all browseable at <a className="doc-link" href="https://github.com/sigil-oss/sigil.app" target="_blank" rel="noopener noreferrer">github.com/sigil-oss/sigil.app</a>.
            </p>
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
