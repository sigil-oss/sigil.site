import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const INSTALL = `npm install @sigil-oss/connect`;

const USE_SIGIL_HOOK = `// hooks/useSigil.ts
import { useCallback, useRef, useState } from 'react';
import {
  sigilRequest,
  type SigilRequest,
  type SigilCallbackResponse,
} from '@sigil-oss/connect';

type Status = 'idle' | 'pending' | 'success' | 'error';

export function useSigil() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<SigilCallbackResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const pendingRef = useRef(false);

  const request = useCallback(async (req: SigilRequest) => {
    if (pendingRef.current) throw new Error('A Sigil request is already in progress');
    pendingRef.current = true;
    setStatus('pending');
    setResult(null);
    setError(null);
    try {
      const res = await sigilRequest(req);
      setResult(res);
      setStatus('success');
      return res;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      setStatus('error');
      throw e;
    } finally {
      pendingRef.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { request, status, result, error, reset };
}`;

const CALLBACK_PAGE = `// pages/__sigil__.tsx  (or any path — just match callbackPath below)
import { useEffect } from 'react';
import { handleRedirect } from '@sigil-oss/connect';

export function SigilCallbackPage() {
  useEffect(() => {
    handleRedirect(); // reads ?result=, broadcasts to useSigil, closes tab
  }, []);
  return null;
}`;

const REACT_ROUTER = `// App.tsx — React Router v6 / v7
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SigilCallbackPage } from './pages/__sigil__';
import { Home } from './pages/Home';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/__sigil__', element: <SigilCallbackPage /> },
  // … rest of your routes
]);

export function App() {
  return <RouterProvider router={router} />;
}`;

const NEXTJS_APP = `// app/__sigil__/page.tsx — Next.js App Router
'use client';
import { useEffect } from 'react';
import { handleRedirect } from '@sigil-oss/connect';

export default function SigilCallbackPage() {
  useEffect(() => {
    handleRedirect();
  }, []);
  return null;
}`;

const NEXTJS_PAGES = `// pages/__sigil__.tsx — Next.js Pages Router
import { useEffect } from 'react';
import { handleRedirect } from '@sigil-oss/connect';

export default function SigilCallbackPage() {
  useEffect(() => {
    handleRedirect();
  }, []);
  return null;
}`;

const CONNECT_BUTTON = `// components/ConnectButton.tsx
import { createConnectRequest } from '@sigil-oss/connect';
import { useSigil } from '../hooks/useSigil';

export function ConnectButton() {
  const { request, status, result, reset } = useSigil();

  async function connect() {
    const res = await request(
      createConnectRequest({
        type: 'connect',
        dapp: { name: 'My App', origin: 'https://myapp.example' },
        permissions: ['transfer', 'sign_message'],
      })
    );
    if (res.status === 'connected') {
      // persist res.identity and res.permissions in your app state
      console.log('identity:', res.identity);
      console.log('permissions:', res.permissions);
    }
  }

  if (status === 'success' && result?.status === 'connected') {
    return (
      <div>
        <p>Connected: {result.identity.slice(0, 8)}…</p>
        <button onClick={reset}>Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={connect} disabled={status === 'pending'}>
      {status === 'pending' ? 'Opening Sigil…' : 'Connect Wallet'}
    </button>
  );
}`;

const SIGN_IN = `// components/SignInButton.tsx
import { createSignMessageRequest } from '@sigil-oss/connect';
import { useSigil } from '../hooks/useSigil';

interface Props {
  onSignIn: (identity: string) => void;
}

export function SignInButton({ onSignIn }: Props) {
  const { request, status, error } = useSigil();

  async function signIn() {
    const nonce = crypto.randomUUID();

    const res = await request(
      createSignMessageRequest({
        type: 'sign_message',
        dapp: { name: 'My App', origin: 'https://myapp.example' },
        // Include nonce and timestamp so the server can prevent replays
        message: [
          'Sign in to My App',
          \`nonce: \${nonce}\`,
          \`issuedAt: \${new Date().toISOString()}\`,
        ].join('\\n'),
      })
    );

    if (res.status !== 'signed' || res.type !== 'sign_message') return;

    // Send to your server for verification
    const response = await fetch('/api/auth/qubic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: res.identity,
        signature: res.signature,
        public_key: res.public_key,
        nonce,
      }),
    });

    if (response.ok) onSignIn(res.identity);
  }

  return (
    <>
      <button onClick={signIn} disabled={status === 'pending'}>
        {status === 'pending' ? 'Waiting for Sigil…' : 'Sign in with Qubic'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </>
  );
}`;

const TRANSFER_BUTTON = `// components/TransferButton.tsx
import { createTransferRequest } from '@sigil-oss/connect';
import { useSigil } from '../hooks/useSigil';

interface Props {
  to: string;
  amount: number;
  onSent?: (txHash: string) => void;
}

export function TransferButton({ to, amount, onSent }: Props) {
  const { request, status, result } = useSigil();

  async function send() {
    const res = await request(
      createTransferRequest({
        type: 'transfer',
        dapp: { name: 'My App', origin: 'https://myapp.example' },
        to,
        amount,
      })
    );

    if (res.status === 'signed' && (res.type === 'transfer' || res.type === 'sc_call')) {
      onSent?.(res.tx_hash);
    }
  }

  if (
    status === 'success' &&
    result?.status === 'signed' &&
    (result.type === 'transfer' || result.type === 'sc_call')
  ) {
    return <p>Sent — tx: {result.tx_hash.slice(0, 12)}…</p>;
  }

  return (
    <button onClick={send} disabled={status === 'pending'}>
      {status === 'pending' ? 'Waiting for Sigil…' : \`Send \${amount.toLocaleString()} QU\`}
    </button>
  );
}`;

const SERVER_VERIFY = `// server: api/auth/qubic.ts (Next.js API route or Express)
// Verify a sign_message callback from the client

export async function POST(req: Request) {
  const { identity, signature, public_key, nonce } = await req.json();

  // 1. Verify the nonce hasn't been used (store in Redis/DB with TTL)
  const nonceKey = \`sigil:nonce:\${nonce}\`;
  const used = await redis.get(nonceKey);
  if (used) return new Response('Nonce already used', { status: 400 });
  await redis.set(nonceKey, '1', { ex: 300 });

  // 2. Reconstruct the message the user signed
  //    You need the nonce and issuedAt from the request — store them server-side
  //    before the redirect, or pass them back from the client.

  // 3. Verify the signature with the Qubic public key
  //    Use the Qubic crypto library on the server to verify.

  // 4. Issue a session token
  const token = await createSession(identity);
  return Response.json({ token });
}`;

export const Route = createFileRoute("/docs/react")({
	head: () => ({
		meta: [
			{
				title:
					"Sigil React Integration — Connect QUBIC Wallet in React & Next.js",
			},
			{
				name: "description",
				content:
					"Integrate Sigil into a React or Next.js app: useSigil hook, callback route setup, connect wallet button, sign-in with Qubic, and transfer examples.",
			},
			{
				property: "og:title",
				content:
					"Sigil React Integration — Connect QUBIC Wallet in React & Next.js",
			},
			{
				property: "og:description",
				content:
					"useSigil hook, callback route setup for React Router and Next.js, connect wallet, sign-in with Qubic, and transfer components.",
			},
			{ property: "og:url", content: "https://sigilwallet.org/docs/react" },
			{
				property: "og:image",
				content: "https://sigilwallet.org/og-image-dark.png",
			},
			{
				name: "twitter:title",
				content:
					"Sigil React Integration — Connect QUBIC Wallet in React & Next.js",
			},
			{
				name: "twitter:description",
				content:
					"useSigil hook, callback route setup for React Router and Next.js, connect wallet, sign-in with Qubic, and transfer components.",
			},
			{
				name: "twitter:image",
				content: "https://sigilwallet.org/og-image-dark.png",
			},
		],
		links: [{ rel: "canonical", href: "https://sigilwallet.org/docs/react" }],
	}),
	loader: async () => {
		const [
			installHtml,
			hookHtml,
			callbackPageHtml,
			reactRouterHtml,
			nextjsAppHtml,
			nextjsPagesHtml,
			connectHtml,
			signInHtml,
			transferHtml,
			serverVerifyHtml,
		] = await Promise.all([
			hl(INSTALL, "bash"),
			hl(USE_SIGIL_HOOK, "typescript"),
			hl(CALLBACK_PAGE, "tsx"),
			hl(REACT_ROUTER, "tsx"),
			hl(NEXTJS_APP, "tsx"),
			hl(NEXTJS_PAGES, "tsx"),
			hl(CONNECT_BUTTON, "tsx"),
			hl(SIGN_IN, "tsx"),
			hl(TRANSFER_BUTTON, "tsx"),
			hl(SERVER_VERIFY, "typescript"),
		]);
		return {
			installHtml,
			hookHtml,
			callbackPageHtml,
			reactRouterHtml,
			nextjsAppHtml,
			nextjsPagesHtml,
			connectHtml,
			signInHtml,
			transferHtml,
			serverVerifyHtml,
		};
	},
	component: ReactPage,
});

function ReactPage() {
	const {
		installHtml,
		hookHtml,
		callbackPageHtml,
		reactRouterHtml,
		nextjsAppHtml,
		nextjsPagesHtml,
		connectHtml,
		signInHtml,
		transferHtml,
		serverVerifyHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ GUIDES ]</div>
			<h1>React integration</h1>
			<p>
				This guide covers everything needed to integrate Sigil into a React app:
				a reusable hook, the callback route that closes the async loop, and
				ready-to-use components for the most common flows.
			</p>

			<div className="callout info">
				<div className="callout-tag">[ HOW IT WORKS ]</div>
				<p>
					<code className="inline">sigilRequest()</code> opens Sigil via a link
					click and returns a <code className="inline">Promise</code> backed by{" "}
					<code className="inline">BroadcastChannel</code>. The page at your{" "}
					<code className="inline">callbackPath</code> (default{" "}
					<code className="inline">/__sigil__</code>) calls{" "}
					<code className="inline">handleRedirect()</code> — it reads the{" "}
					<code className="inline">?result=</code> param and resolves the
					Promise. Both routes must be on the same origin.
				</p>
			</div>

			<h2 id="install">Install</h2>
			<CodeBlock html={installHtml} label="TERMINAL" />

			<h2 id="hook">useSigil hook</h2>
			<p>
				A thin wrapper around <code className="inline">sigilRequest()</code>{" "}
				that exposes <code className="inline">status</code>,{" "}
				<code className="inline">result</code>, and{" "}
				<code className="inline">error</code> as React state. Drop it in your{" "}
				<code className="inline">hooks/</code> folder and reuse across
				components.
			</p>
			<CodeBlock html={hookHtml} label="hooks/useSigil.ts" />

			<h2 id="callback-route">Callback route</h2>
			<p>
				Create a minimal page at <code className="inline">/__sigil__</code> (or
				whatever <code className="inline">callbackPath</code> you pass to{" "}
				<code className="inline">sigilRequest</code>). It calls{" "}
				<code className="inline">handleRedirect()</code> on mount, broadcasts
				the result, and the tab closes itself.
			</p>
			<CodeBlock html={callbackPageHtml} label="pages/__sigil__.tsx" />

			<h3 id="react-router">React Router v6 / v7</h3>
			<CodeBlock html={reactRouterHtml} label="App.tsx" />

			<h3 id="nextjs-app">Next.js — App Router</h3>
			<CodeBlock html={nextjsAppHtml} label="app/__sigil__/page.tsx" />

			<h3 id="nextjs-pages">Next.js — Pages Router</h3>
			<CodeBlock html={nextjsPagesHtml} label="pages/__sigil__.tsx" />

			<h2 id="connect">Connect wallet</h2>
			<p>
				Ask the user to pair their wallet and optionally pre-grant permissions.
				The result includes the Qubic identity and the approved permission set.
			</p>
			<CodeBlock html={connectHtml} label="components/ConnectButton.tsx" />

			<h2 id="sign-in">Sign in with Qubic</h2>
			<p>
				Off-chain authentication — no transaction, no fee. The user signs a
				message that includes a nonce and timestamp; your server verifies the
				signature against the public key to prove identity ownership.
			</p>
			<CodeBlock html={signInHtml} label="components/SignInButton.tsx" />
			<CodeBlock html={serverVerifyHtml} label="api/auth/qubic.ts (server)" />

			<div className="callout warn">
				<div className="callout-tag">[ VERIFY SERVER-SIDE ]</div>
				<p>
					Never trust the identity the client sends without verifying the
					signature on your server. The client-side result is not authenticated
					— only the signature proves the user holds the corresponding private
					key.
				</p>
			</div>

			<h2 id="transfer">Request a transfer</h2>
			<p>
				Ask the user to sign and broadcast a QU transfer. The callback includes
				the transaction hash and target tick once Sigil submits it to the
				network.
			</p>
			<CodeBlock html={transferHtml} label="components/TransferButton.tsx" />
		</div>
	);
}
