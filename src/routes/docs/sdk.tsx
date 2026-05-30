import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const INSTALL = `npm install @sigil-oss/connect`;

const REDIRECT_URI = `import { buildUri } from '@sigil-oss/connect';

// No server needed — result comes back as a query param
const uri = buildUri({
  request: {
    type: 'sign_message',
    nonce: sessionStorage.getItem('pending_nonce') ?? crypto.randomUUID(),
    dapp: { name: 'My App', origin: 'https://myapp.example' },
    message: 'Sign in to My App · ' + new Date().toISOString(),
  },
  redirect_uri: 'https://myapp.example/signed', // Sigil opens this after the user acts
});

window.location.href = uri;

// On https://myapp.example/signed:
function handleRedirect() {
  const encoded = new URLSearchParams(location.search).get('result');
  if (!encoded) return;
  const result = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  // result.status === 'signed' | 'rejected'
  // result.nonce — verify against what you stored before navigating away
  console.log(result);
}`;

const BUILD_URI = `import { buildUri } from '@sigil-oss/connect';

const uri = buildUri({
  request: {
    type: 'connect',
    nonce: crypto.randomUUID(),
    dapp: { name: 'My App', origin: 'https://myapp.example' },
    permissions: ['transfer', 'sign_message'],
  },
  callback: 'https://myapp.example/api/sigil/callback',
});

window.location.href = uri;`;

const TRANSFER_URI = `import { buildUri } from '@sigil-oss/connect';

const uri = buildUri({
  request: {
    type: 'transfer',
    nonce: crypto.randomUUID(),
    dapp: { name: 'My App', origin: 'https://myapp.example' },
    to: 'NQZBXKZP4MTLDUVWXYZK8MFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    amount: 1_500_000,
  },
  callback: 'https://myapp.example/api/sigil/callback',
});

window.location.href = uri;`;

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

const SIGNED_KEY = `import { generateKey, buildSignedUri } from '@sigil-oss/connect';

// Run once — persist privateKey securely, expose publicJwk to the SDK
const { privateKey, publicJwk } = await generateKey();

// Later: sign a request server-side before redirecting the client
const uri = await buildSignedUri(
  {
    request: {
      type: 'connect',
      nonce: crypto.randomUUID(),
      dapp: { name: 'My App', origin: 'https://myapp.example' },
    },
    callback: 'https://myapp.example/api/sigil/callback',
  },
  { privateKey, publicJwk, issuer: 'https://myapp.example' },
);`;

export const Route = createFileRoute("/docs/sdk")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — @sigil-oss/connect SDK" },
			{
				name: "description",
				content:
					"Install and use the @sigil-oss/connect SDK to build Sigil deep-link URIs, sign envelopes with ES256, and parse callback results.",
			},
		],
	}),
	loader: async () => {
		const [
			installHtml,
			buildUriHtml,
			transferHtml,
			redirectUriHtml,
			parseHtml,
			signedHtml,
		] = await Promise.all([
			hl(INSTALL, "bash"),
			hl(BUILD_URI, "typescript"),
			hl(TRANSFER_URI, "typescript"),
			hl(REDIRECT_URI, "typescript"),
			hl(PARSE_CALLBACK, "typescript"),
			hl(SIGNED_KEY, "typescript"),
		]);
		return {
			installHtml,
			buildUriHtml,
			transferHtml,
			redirectUriHtml,
			parseHtml,
			signedHtml,
		};
	},
	component: SdkPage,
});

function SdkPage() {
	const {
		installHtml,
		buildUriHtml,
		transferHtml,
		redirectUriHtml,
		parseHtml,
		signedHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ SDK ]</div>
			<h1>
				@sigil-oss/<span className="doto">connect</span>
			</h1>
			<p>
				Official TypeScript SDK for the Sigil deep-link protocol. It builds
				envelopes, handles base64url encoding, optionally signs requests with
				ES256, and gives you typed callback results. Everything the SDK does you
				can also do by hand — see the{" "}
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
				<code className="inline">buildUri</code> wraps the request in an
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

			<h2 id="signed">Signed requests</h2>
			<p>
				Unsigned requests display a{" "}
				<code className="inline">legacy_unverified</code> badge in Sigil's
				review UI — the dApp name and origin are self-reported and unverifiable.
				Signed requests carry an ES256 <code className="inline">proof</code>; if
				the proof is valid and the issuer appears in Sigil's registry, the
				request shows as <code className="inline">verified_registry</code>. An
				invalid signature blocks the request entirely.
			</p>
			<CodeBlock html={signedHtml} label="TYPESCRIPT" />

			<div className="callout warn">
				<div className="callout-tag">[ NEVER IN THE BROWSER ]</div>
				<p>
					Sign on the server. Build the <code className="inline">sigil://</code>{" "}
					URI server-side and redirect the client to it, or return it as JSON.
					Exposing a private key in client-side code lets anyone impersonate
					your dApp.
				</p>
			</div>
		</div>
	);
}
