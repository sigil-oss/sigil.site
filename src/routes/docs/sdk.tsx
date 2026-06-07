import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const INSTALL = `npm install @sigil-oss/connect`;

const REDIRECT_URI = `import { sigilRequest, createSignMessageRequest } from '@sigil-oss/connect';

// One await — no server, no redirect boilerplate.
// Sigil opens /__sigil__ after the user acts; handleRedirect() there
// broadcasts the result back and this Promise resolves.
const result = await sigilRequest(
  createSignMessageRequest({
    type: 'sign_message',
    dapp: { name: 'My App', origin: 'https://myapp.example' },
    message: 'Sign in to My App · ' + new Date().toISOString(),
  }),
);

if (result.status === 'signed') {
  console.log('identity:', result.identity);
}`;

const BUILD_URI = `import { buildSigilUrl, createEnvelope, createConnectRequest } from '@sigil-oss/connect';

const url = buildSigilUrl(
  createEnvelope(
    createConnectRequest({
      type: 'connect',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      permissions: ['transfer', 'sign_message'],
    }),
    { callback: 'https://myapp.example/api/sigil/callback' },
  )
);

window.location.href = url;`;

const TRANSFER_URI = `import { buildSigilUrl, createEnvelope, createTransferRequest } from '@sigil-oss/connect';

const url = buildSigilUrl(
  createEnvelope(
    createTransferRequest({
      type: 'transfer',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      to: 'NQZBXKZP4MTLDUVWXYZK8MFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amount: 1_500_000,
    }),
    { callback: 'https://myapp.example/api/sigil/callback' },
  )
);

window.location.href = url;`;

const PARSE_CALLBACK = `import { parseCallback, type SigilResult } from '@sigil-oss/connect';

// POST /api/sigil/callback
app.post('/api/sigil/callback', express.json(), async (req, res) => {
  const result: SigilResult = parseCallback(req.body);

  // Always verify the nonce against what you sent
  if (result.nonce !== pendingNonces.get(result.nonce)) {
    return res.status(400).json({ error: 'nonce_mismatch' });
  }

  if (result.status === 'connected') {
    console.log('Paired identity:', result.identity);
    console.log('Granted permissions:', result.permissions);
  } else if (result.status === 'signed') {
    console.log('Transaction hash:', result.tx_hash);
  } else if (result.status === 'rejected') {
    console.log('Rejected, reason:', result.reason);
  }

  res.sendStatus(200);
});`;

const ASYNC_REQUEST = `import { sigilRequest, createSignMessageRequest } from '@sigil-oss/connect';

// One await — no server, no redirect boilerplate
const result = await sigilRequest(
  createSignMessageRequest({
    type: 'sign_message',
    dapp: { name: 'My App', origin: 'https://myapp.example' },
    message: 'Sign in to My App · ' + new Date().toISOString(),
  }),
  // Sigil opens /__sigil__ after the user acts; handleRedirect() broadcasts
  // the result back over a BroadcastChannel and this Promise resolves.
  { callbackPath: '/__sigil__' },
);

if (result.status === 'signed') {
  console.log('identity:', result.identity);
  console.log('signature:', result.signature);
}`;

const HANDLE_REDIRECT = `// Mount this at the callbackPath route in your app — e.g. pages/__sigil__.tsx
import { handleRedirect } from '@sigil-oss/connect';

// Call it on page load. It reads ?result=…, posts to the BroadcastChannel
// that sigilRequest() is listening on, then closes the tab.
handleRedirect();`;

export const Route = createFileRoute("/docs/sdk")({
	head: () => ({
		meta: [
			{
				title:
					"@sigil-oss/connect SDK — QUBIC dApp Integration for TypeScript",
			},
			{
				name: "description",
				content:
					"Install and use the @sigil-oss/connect TypeScript SDK: async sigilRequest() for zero-server dApps, or manual URI building with callback/redirect_uri delivery.",
			},
			{
				property: "og:title",
				content:
					"@sigil-oss/connect SDK — QUBIC dApp Integration for TypeScript",
			},
			{
				property: "og:description",
				content:
					"TypeScript SDK for Sigil: async sigilRequest(), URI building, callback parsing. Integrate QUBIC wallet signing into any web app.",
			},
			{ property: "og:url", content: "https://sigilwallet.org/docs/sdk" },
			{
				property: "og:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
			{
				name: "twitter:title",
				content:
					"@sigil-oss/connect SDK — QUBIC dApp Integration for TypeScript",
			},
			{
				name: "twitter:description",
				content:
					"TypeScript SDK for Sigil: async sigilRequest(), URI building, callback parsing. Integrate QUBIC wallet signing into any web app.",
			},
			{
				name: "twitter:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
		],
		links: [{ rel: "canonical", href: "https://sigilwallet.org/docs/sdk" }],
	}),
	loader: async () => {
		const [
			installHtml,
			asyncRequestHtml,
			handleRedirectHtml,
			buildUriHtml,
			transferHtml,
			redirectUriHtml,
			parseHtml,
		] = await Promise.all([
			hl(INSTALL, "bash"),
			hl(ASYNC_REQUEST, "typescript"),
			hl(HANDLE_REDIRECT, "typescript"),
			hl(BUILD_URI, "typescript"),
			hl(TRANSFER_URI, "typescript"),
			hl(REDIRECT_URI, "typescript"),
			hl(PARSE_CALLBACK, "typescript"),
		]);
		return {
			installHtml,
			asyncRequestHtml,
			handleRedirectHtml,
			buildUriHtml,
			transferHtml,
			redirectUriHtml,
			parseHtml,
		};
	},
	component: SdkPage,
});

function SdkPage() {
	const {
		installHtml,
		asyncRequestHtml,
		handleRedirectHtml,
		buildUriHtml,
		transferHtml,
		redirectUriHtml,
		parseHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ SDK ]</div>
			<h1>
				@sigil-oss/<span className="doto">connect</span>
			</h1>
			<p>
				Official TypeScript SDK for the Sigil deep-link protocol. Build
				envelopes, launch requests, and handle results — either as a simple{" "}
				<code className="inline">await</code> or via manual URI construction.
				See the{" "}
				<a className="doc-link" href="/docs/payload">
					Payload format
				</a>{" "}
				page.
			</p>

			<div className="callout info">
				<div className="callout-tag">[ SOURCE ]</div>
				<p>
					<a
						className="doc-link"
						href="https://github.com/sigil-oss/sigil.connect"
						target="_blank"
						rel="noopener noreferrer"
					>
						github.com/sigil-oss/sigil.connect
					</a>{" "}
					— TypeScript types, changelog, and full API reference.
				</p>
			</div>

			<h2 id="install">Install</h2>
			<CodeBlock html={installHtml} label="TERMINAL" />

			<h2 id="connect">Connect request</h2>
			<p>
				<code className="inline">buildSigilUrl</code> wraps the request in an
				envelope, base64url-encodes it, and returns a{" "}
				<code className="inline">sigil://v1/request?d=…</code> URI ready to
				open.
			</p>
			<CodeBlock html={buildUriHtml} label="TYPESCRIPT" />

			<h2 id="transfer">Transfer request</h2>
			<CodeBlock html={transferHtml} label="TYPESCRIPT" />

			<h2 id="redirect-uri">Redirect URI — no server needed</h2>
			<p>
				Pass <code className="inline">redirect_uri</code> instead of (or
				alongside) <code className="inline">callback</code>. After the user
				acts, Sigil opens{" "}
				<code className="inline">
					redirect_uri?result=&lt;base64url JSON&gt;
				</code>{" "}
				in the default browser. Read the result client-side — no endpoint, no
				infra.
			</p>
			<CodeBlock html={redirectUriHtml} label="TYPESCRIPT" />

			<div className="callout warn">
				<div className="callout-tag">[ RESULT IS IN THE URL ]</div>
				<p>
					With <code className="inline">redirect_uri</code>, the signed result
					lands in the browser URL bar and history. Use{" "}
					<code className="inline">callback</code> for anything involving real
					money or sensitive data that must stay server-side.
				</p>
			</div>

			<h2 id="callback">Parsing the server callback</h2>
			<p>
				Sigil POSTs a JSON body to your callback URL from the Rust layer.{" "}
				<code className="inline">parseCallback</code> validates the shape and
				narrows the type. Always verify the nonce before acting on the result.
			</p>
			<CodeBlock html={parseHtml} label="TYPESCRIPT" />

			<h2 id="async">Async API — await the result</h2>
			<p>
				<code className="inline">sigilRequest()</code> launches Sigil via a link
				click (the page stays alive), then returns a{" "}
				<code className="inline">Promise</code> that resolves when the user
				acts. Internally it uses{" "}
				<code className="inline">BroadcastChannel</code> — no server, no
				polling.
			</p>
			<CodeBlock html={asyncRequestHtml} label="TYPESCRIPT" />

			<h2 id="handle-redirect">handleRedirect — callback page</h2>
			<p>
				Mount this at the <code className="inline">callbackPath</code> route in
				your app (default <code className="inline">/__sigil__</code>). It reads
				the <code className="inline">?result=</code> param, broadcasts it to the
				waiting <code className="inline">sigilRequest()</code> Promise, and
				closes the tab.
			</p>
			<CodeBlock html={handleRedirectHtml} label="TYPESCRIPT" />
		</div>
	);
}
