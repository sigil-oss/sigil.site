import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const EXPRESS_SETUP = `import express from 'express';
import { parseCallbackResponse } from '@sigil-oss/connect';

const app = express();
app.use(express.json({ limit: '16kb' })); // Sigil result bodies are small`;

const EXPRESS_CALLBACK = `// POST /api/sigil/callback  — receives Sigil's HTTP POST after user acts
app.post('/api/sigil/callback', async (req, res) => {
  // 1. Parse and validate the shape
  let result;
  try {
    result = parseCallbackResponse(req.body);
  } catch {
    return res.status(400).json({ error: 'invalid_payload' });
  }

  // 2. Verify the nonce — match it against what you stored when building the request
  const pending = await db.pendingRequest.findUnique({ where: { nonce: result.nonce } });
  if (!pending) return res.status(400).json({ error: 'unknown_nonce' });
  await db.pendingRequest.delete({ where: { nonce: result.nonce } });

  // 3. Handle each outcome
  switch (result.status) {
    case 'connected':
      await db.session.upsert({
        where: { identity: result.identity },
        create: { identity: result.identity, permissions: result.permissions },
        update: { permissions: result.permissions },
      });
      break;

    case 'signed':
      if (result.type === 'transfer' || result.type === 'sc_call') {
        await db.transaction.create({
          data: {
            txHash: result.tx_hash,
            identity: result.identity,
            targetTick: result.target_tick,
          },
        });
      }
      break;

    case 'rejected':
      // result.reason === 'user_rejected'
      break;
  }

  res.sendStatus(200); // Sigil retries on non-2xx
});`;

const NONCE_STORE = `// Before building the sigil:// URI, store the nonce server-side
// so the callback handler can verify it belongs to a real request.

import { createConnectRequest } from '@sigil-oss/connect';

app.get('/api/sigil/connect', async (req, res) => {
  const req_ = createConnectRequest({
    type: 'connect',
    dapp: { name: 'My App', origin: 'https://myapp.example' },
    permissions: ['transfer', 'sign_message'],
  });

  // Store nonce with TTL matching the request expiry
  await db.pendingRequest.create({
    data: { nonce: req_.nonce, expiresAt: new Date(req_.exp! * 1000) },
  });

  // Return the URI to the client — client opens it
  const url = buildSigilUrl(
    createEnvelope(req_, { callback: 'https://myapp.example/api/sigil/callback' })
  );
  res.json({ url });
});`;

const SIGN_IN_VERIFY = `// POST /api/auth/qubic — verify a sign_message result sent from the browser

import { parseCallbackResponse } from '@sigil-oss/connect';
import { verifyQubicSignature } from '@qubic-lib/crypto'; // your Qubic crypto lib

app.post('/api/auth/qubic', async (req, res) => {
  const { identity, signature, public_key, nonce } = req.body;

  // 1. Check nonce hasn't been used before (Redis or DB, 5-min TTL)
  const used = await redis.get(\`sigil:nonce:\${nonce}\`);
  if (used) return res.status(400).json({ error: 'nonce_reused' });
  await redis.set(\`sigil:nonce:\${nonce}\`, '1', 'EX', 300);

  // 2. Reconstruct the exact message that was signed
  //    You need the nonce and issuedAt — either store them server-side before
  //    the redirect or have the client echo them back from sessionStorage.
  const message = [
    'Sign in to My App',
    \`nonce: \${nonce}\`,
    \`issuedAt: \${req.body.issuedAt}\`,
  ].join('\\n');

  // 3. Verify the Qubic signature
  const valid = await verifyQubicSignature({ message, signature, publicKey: public_key });
  if (!valid) return res.status(401).json({ error: 'invalid_signature' });

  // 4. Identity is verified — issue a session
  const token = await createSession(identity);
  res.json({ token });
});`;

const NEXTJS_CALLBACK = `// app/api/sigil/callback/route.ts — Next.js App Router
import { parseCallbackResponse } from '@sigil-oss/connect';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  let result;
  try {
    result = parseCallbackResponse(body);
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // Verify nonce, handle result…
  switch (result.status) {
    case 'connected':
      // store session
      break;
    case 'signed':
      // record tx
      break;
    case 'rejected':
      break;
  }

  return new NextResponse(null, { status: 200 });
}`;

const NEXTJS_SIGN_IN = `// app/api/auth/qubic/route.ts — Next.js App Router
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { identity, signature, public_key, nonce, issuedAt } = await request.json();

  // Deduplicate nonce
  const key = \`sigil:nonce:\${nonce}\`;
  if (await redis.get(key)) {
    return NextResponse.json({ error: 'nonce_reused' }, { status: 400 });
  }
  await redis.set(key, '1', { ex: 300 });

  // Reconstruct and verify
  const message = ['Sign in to My App', \`nonce: \${nonce}\`, \`issuedAt: \${issuedAt}\`].join('\\n');
  const valid = await verifyQubicSignature({ message, signature, publicKey: public_key });
  if (!valid) return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });

  const token = await createSession(identity);
  return NextResponse.json({ token });
}`;

export const Route = createFileRoute("/docs/server")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — Server-Side Integration" },
			{
				name: "description",
				content:
					"Receive and verify Sigil callback POSTs on your server: Express.js setup, nonce validation, sign-in verification, and Next.js API routes.",
			},
		],
	}),
	loader: async () => {
		const [
			expressSetupHtml,
			expressCallbackHtml,
			nonceStoreHtml,
			signInVerifyHtml,
			nextjsCallbackHtml,
			nextjsSignInHtml,
		] = await Promise.all([
			hl(EXPRESS_SETUP, "typescript"),
			hl(EXPRESS_CALLBACK, "typescript"),
			hl(NONCE_STORE, "typescript"),
			hl(SIGN_IN_VERIFY, "typescript"),
			hl(NEXTJS_CALLBACK, "typescript"),
			hl(NEXTJS_SIGN_IN, "typescript"),
		]);
		return {
			expressSetupHtml,
			expressCallbackHtml,
			nonceStoreHtml,
			signInVerifyHtml,
			nextjsCallbackHtml,
			nextjsSignInHtml,
		};
	},
	component: ServerPage,
});

function ServerPage() {
	const {
		expressSetupHtml,
		expressCallbackHtml,
		nonceStoreHtml,
		signInVerifyHtml,
		nextjsCallbackHtml,
		nextjsSignInHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ GUIDES ]</div>
			<h1>Server-side integration</h1>
			<p>
				Use <code className="inline">callback</code> when your app has a server.
				Sigil POSTs the result from its Rust layer directly to your endpoint —
				the result never touches the browser URL bar, and your server can
				validate, store, and act on it atomically.
			</p>

			<div className="callout info">
				<div className="callout-tag">[ CALLBACK vs REDIRECT_URI ]</div>
				<p>
					<code className="inline">callback</code> (this guide) is right for
					anything involving real money or server-managed sessions.{" "}
					<code className="inline">redirect_uri</code> is simpler but puts the
					result in the browser URL — see the{" "}
					<a className="doc-link" href="/docs/react">
						React
					</a>{" "}
					or{" "}
					<a className="doc-link" href="/docs/vanilla">
						Vanilla JS
					</a>{" "}
					guides for that pattern.
				</p>
			</div>

			<h2 id="express">Express.js</h2>

			<h3 id="setup">Setup</h3>
			<CodeBlock html={expressSetupHtml} label="server.ts" />

			<h3 id="callback-endpoint">Callback endpoint</h3>
			<p>
				Sigil POSTs to this URL after the user approves or rejects. Always
				respond <code className="inline">200</code> once you've accepted the
				payload — Sigil will retry on non-2xx responses.
			</p>
			<CodeBlock html={expressCallbackHtml} label="routes/sigil.ts" />

			<h3 id="nonce-store">Storing nonces before the request</h3>
			<p>
				Build the <code className="inline">sigil://</code> URI server-side and
				persist the nonce so the callback handler can verify it. Never build the
				URI directly in the browser when using server callbacks — the client
				can't be trusted to generate nonces that your server hasn't seen.
			</p>
			<CodeBlock html={nonceStoreHtml} label="routes/sigil.ts" />

			<div className="callout warn">
				<div className="callout-tag">[ ALWAYS VERIFY THE NONCE ]</div>
				<p>
					A callback with an unknown nonce is either a replay or a request you
					didn't originate. Reject it before touching any application state.
					Delete the nonce from the store on first use so it can't be replayed.
				</p>
			</div>

			<h3 id="sign-in-verify">Sign-in verification</h3>
			<p>
				For the sign-in pattern — user signs a message, your server verifies the
				signature against their Qubic public key. Use the{" "}
				<code className="inline">@qubic-lib/crypto</code> package or equivalent
				to verify the Qubic ECDSA signature.
			</p>
			<CodeBlock html={signInVerifyHtml} label="routes/auth.ts" />

			<h2 id="nextjs">Next.js</h2>

			<h3 id="nextjs-callback">Callback route — App Router</h3>
			<CodeBlock
				html={nextjsCallbackHtml}
				label="app/api/sigil/callback/route.ts"
			/>

			<h3 id="nextjs-sign-in">Sign-in route — App Router</h3>
			<CodeBlock html={nextjsSignInHtml} label="app/api/auth/qubic/route.ts" />
		</div>
	);
}
