import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const CDN = `<!-- No build tools needed — import directly in a module script -->
<script type="module">
  import {
    sigilRequest,
    createConnectRequest,
  } from 'https://esm.sh/@sigil-oss/connect@latest';

  document.getElementById('connect-btn').addEventListener('click', async () => {
    const result = await sigilRequest(
      createConnectRequest({
        type: 'connect',
        dapp: { name: 'My App', origin: 'https://myapp.example' },
        permissions: ['transfer', 'sign_message'],
      })
    );

    if (result.status === 'connected') {
      console.log('identity:', result.identity);
    }
  });
</script>`;

const NPM = `npm install @sigil-oss/connect`;

const CALLBACK_HTML = `<!-- public/__sigil__/index.html  (or route /__sigil__ in your server) -->
<!doctype html>
<html>
  <head><title>Sigil callback</title></head>
  <body>
    <script type="module">
      import { handleRedirect } from 'https://esm.sh/@sigil-oss/connect@latest';
      handleRedirect(); // reads ?result=, broadcasts, closes tab
    </script>
  </body>
</html>`;

const CONNECT = `import {
  sigilRequest,
  createConnectRequest,
} from '@sigil-oss/connect';

const btn = document.getElementById('connect-btn');
if (!btn) throw new Error('connect-btn not found');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  btn.textContent = 'Opening Sigil…';

  try {
    const result = await sigilRequest(
      createConnectRequest({
        type: 'connect',
        dapp: { name: 'My App', origin: 'https://myapp.example' },
        permissions: ['transfer', 'sign_message'],
      })
    );

    if (result.status === 'connected') {
      const el = document.getElementById('identity');
    if (el) el.textContent = result.identity;
    } else {
      btn.textContent = 'Rejected';
    }
  } catch {
    btn.textContent = 'Timed out';
  } finally {
    btn.disabled = false;
  }
});`;

const SIGN_IN = `import {
  sigilRequest,
  createSignMessageRequest,
} from '@sigil-oss/connect';

async function signIn() {
  const nonce = crypto.randomUUID();

  const result = await sigilRequest(
    createSignMessageRequest({
      type: 'sign_message',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      message: [
        'Sign in to My App',
        \`nonce: \${nonce}\`,
        \`issuedAt: \${new Date().toISOString()}\`,
      ].join('\\n'),
    })
  );

  if (result.status !== 'signed' || result.type !== 'sign_message') return;

  const res = await fetch('/api/auth/qubic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: result.identity,
      signature: result.signature,
      public_key: result.public_key,
      nonce,
    }),
  });

  if (res.ok) {
    const { token } = await res.json();
    sessionStorage.setItem('token', token);
    window.location.href = '/dashboard';
  }
}

document.getElementById('signin-btn').addEventListener('click', signIn);`;

const TRANSFER = `import {
  sigilRequest,
  createTransferRequest,
} from '@sigil-oss/connect';

async function sendPayment(to, amount) {
  const result = await sigilRequest(
    createTransferRequest({
      type: 'transfer',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      to,
      amount,
    })
  );

  if (result.status === 'signed' && (result.type === 'transfer' || result.type === 'sc_call')) {
    console.log('tx hash:', result.tx_hash);
    console.log('target tick:', result.target_tick);
  }
}`;

export const Route = createFileRoute("/docs/vanilla")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — Vanilla JS Integration" },
			{
				name: "description",
				content:
					"Integrate Sigil into a vanilla JavaScript app with no build tools — CDN import, callback page setup, connect, sign-in, and transfer examples.",
			},
		],
	}),
	loader: async () => {
		const [
			cdnHtml,
			npmHtml,
			callbackHtml,
			connectHtml,
			signInHtml,
			transferHtml,
		] = await Promise.all([
			hl(CDN, "html"),
			hl(NPM, "bash"),
			hl(CALLBACK_HTML, "html"),
			hl(CONNECT, "javascript"),
			hl(SIGN_IN, "javascript"),
			hl(TRANSFER, "javascript"),
		]);
		return {
			cdnHtml,
			npmHtml,
			callbackHtml,
			connectHtml,
			signInHtml,
			transferHtml,
		};
	},
	component: VanillaPage,
});

function VanillaPage() {
	const {
		cdnHtml,
		npmHtml,
		callbackHtml,
		connectHtml,
		signInHtml,
		transferHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ GUIDES ]</div>
			<h1>Vanilla JS</h1>
			<p>
				No framework, no build step required. Import directly from a CDN for
				quick prototypes or install via npm for production builds.
			</p>

			<h2 id="install">Install</h2>
			<h3>CDN — no build tools</h3>
			<CodeBlock html={cdnHtml} label="HTML" />

			<h3>npm</h3>
			<CodeBlock html={npmHtml} label="TERMINAL" />

			<h2 id="callback-page">Callback page</h2>
			<p>
				Create a page at <code className="inline">/__sigil__</code> on your
				origin. It calls <code className="inline">handleRedirect()</code>, which
				reads <code className="inline">?result=</code>, signals the waiting{" "}
				<code className="inline">sigilRequest()</code> Promise via{" "}
				<code className="inline">BroadcastChannel</code>, then closes the tab.
			</p>
			<CodeBlock html={callbackHtml} label="public/__sigil__/index.html" />

			<div className="callout info">
				<div className="callout-tag">[ STATIC SITES ]</div>
				<p>
					For static hosting (Netlify, Vercel, GitHub Pages), create{" "}
					<code className="inline">public/__sigil__/index.html</code>. For
					server-rendered apps, add a route that serves the handler script at{" "}
					<code className="inline">/__sigil__</code>.
				</p>
			</div>

			<h2 id="connect">Connect wallet</h2>
			<CodeBlock html={connectHtml} label="JAVASCRIPT" />

			<h2 id="sign-in">Sign in with Qubic</h2>
			<CodeBlock html={signInHtml} label="JAVASCRIPT" />

			<h2 id="transfer">Request a transfer</h2>
			<CodeBlock html={transferHtml} label="JAVASCRIPT" />
		</div>
	);
}
