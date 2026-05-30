import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const FULL_EXAMPLE = `import { buildUri } from '@sigil-oss/connect';

// 1. Store the nonce so you can verify it in the callback
const nonce = crypto.randomUUID();
sessionStorage.setItem('pending_nonce', nonce);

// 2. Build the URI
const uri = buildUri({
  request: {
    type: 'transfer',
    nonce,
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    to: 'NQZBXKZP4MTLDUVWXYZK8MFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    amount: 1_000_000,
    exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  },
  callback: 'https://acme.example/api/sigil/callback',
});

// 3. Hand off to Sigil
window.location.href = uri;`;

const CALLBACK_VERIFY = `// POST https://acme.example/api/sigil/callback
app.post('/api/sigil/callback', express.json(), (req, res) => {
  const { status, type, nonce, ...rest } = req.body;

  // Reject unknown nonces immediately
  if (!pendingNonces.has(nonce)) {
    return res.sendStatus(400);
  }
  pendingNonces.delete(nonce);

  switch (status) {
    case 'signed':
      // type === 'transfer' | 'sc_call'
      handleSigned(rest.identity, rest.tx_hash, rest.target_tick);
      break;
    case 'connected':
      handleConnect(rest.identity, rest.permissions);
      break;
    case 'signed': // sign_message
      handleSignature(rest.identity, rest.signature, rest.public_key);
      break;
    case 'verified':
      handleVerify(rest.valid, rest.identity);
      break;
    case 'rejected':
      handleRejection(rest.reason);
      break;
  }

  res.sendStatus(200);
});`;

const MANUAL_BUILD = `// Without the SDK — matches what buildUri() does internally
function b64url(str: string): string {
  return btoa(str)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

const envelope = {
  request: {
    type: 'sign_message',
    nonce: crypto.randomUUID(),
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    message: 'Sign in to Acme · ' + new Date().toISOString(),
  },
  callback: 'https://acme.example/api/sigil/callback',
};

const uri = 'sigil://v1/request?d=' + b64url(JSON.stringify(envelope));
window.location.href = uri;`;

const REDIRECT_EXAMPLE = `// Static site / SPA — no server required
function b64url(str: string): string {
  return btoa(str).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

// 1. Build the request, store nonce for verification after redirect
const nonce = crypto.randomUUID();
sessionStorage.setItem('sigil_nonce', nonce);

const envelope = {
  request: {
    type: 'sign_message',
    nonce,
    dapp: { name: 'Acme', origin: 'https://acme.example' },
    message: 'Sign in to Acme · ' + new Date().toISOString(),
  },
  redirect_uri: 'https://acme.example/signed', // Sigil opens this when done
};

window.location.href = 'sigil://v1/request?d=' + b64url(JSON.stringify(envelope));

// 2. On https://acme.example/signed — parse the result
const encoded = new URLSearchParams(location.search).get('result');
if (encoded) {
  const result = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  const storedNonce = sessionStorage.getItem('sigil_nonce');

  if (result.nonce !== storedNonce) throw new Error('nonce mismatch');

  if (result.status === 'signed') {
    console.log('Signed by:', result.identity);
    console.log('Signature:', result.signature);
  } else {
    console.log('Rejected:', result.reason);
  }
}`;

export const Route = createFileRoute("/docs/reference")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — Errors, Validation & Examples" },
			{
				name: "description",
				content:
					"Rejection reasons, validation error codes, trust levels, and a complete end-to-end Sigil integration example.",
			},
		],
	}),
	loader: async () => {
		const [
			fullExampleHtml,
			callbackHtml,
			redirectExampleHtml,
			manualBuildHtml,
		] = await Promise.all([
			hl(FULL_EXAMPLE, "typescript"),
			hl(CALLBACK_VERIFY, "typescript"),
			hl(REDIRECT_EXAMPLE, "typescript"),
			hl(MANUAL_BUILD, "typescript"),
		]);
		return {
			fullExampleHtml,
			callbackHtml,
			redirectExampleHtml,
			manualBuildHtml,
		};
	},
	component: ReferencePage,
});

function ReferencePage() {
	const {
		fullExampleHtml,
		callbackHtml,
		redirectExampleHtml,
		manualBuildHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ REFERENCE ]</div>
			<h1>Errors &amp; examples</h1>

			<h2 id="example">Server callback example</h2>
			<p>
				A transfer request from start to finish — build the URI, hand off to
				Sigil, receive the result via server POST.
			</p>
			<CodeBlock html={fullExampleHtml} label="CLIENT (TYPESCRIPT)" />
			<CodeBlock html={callbackHtml} label="SERVER CALLBACK (TYPESCRIPT)" />

			<h2 id="redirect-example">Redirect URI example</h2>
			<p>
				Static site or SPA with no server — result delivered as a query
				parameter when Sigil redirects the browser back to your page.
			</p>
			<CodeBlock html={redirectExampleHtml} label="TYPESCRIPT (CLIENT-ONLY)" />

			<h2 id="rejection-reasons">Rejection reasons</h2>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>reason</th>
							<th>Meaning</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code className="inline">user_rejected</code>
							</td>
							<td>The user tapped Reject or closed the review screen</td>
						</tr>
						<tr>
							<td>
								<code className="inline">expired</code>
							</td>
							<td>
								The request's <code className="inline">exp</code> timestamp
								passed before the user acted
							</td>
						</tr>
						<tr>
							<td>
								<code className="inline">wallet_locked</code>
							</td>
							<td>
								Wallet was locked and the user did not unlock in time (queue
								timeout)
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 id="validation-errors">Validation errors</h2>
			<p>
				These cause Sigil to silently discard the request before showing it to
				the user. Check the Rust validator at{" "}
				<code className="inline">src-tauri/src/deep_link.rs</code> for the
				canonical list.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Condition</th>
							<th>Cause</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Envelope too large</td>
							<td>
								Base64-encoded <code className="inline">d</code> exceeds 8 192
								bytes
							</td>
						</tr>
						<tr>
							<td>Invalid scheme / path</td>
							<td>
								URI is not{" "}
								<code className="inline">sigil://v1/request?d=…</code>
							</td>
						</tr>
						<tr>
							<td>Nonce too short / too long</td>
							<td>
								Must be 16–128 chars, alphanumeric or{" "}
								<code className="inline">-_=+</code>
							</td>
						</tr>
						<tr>
							<td>Nonce replay</td>
							<td>Same nonce seen within the last hour</td>
						</tr>
						<tr>
							<td>
								Missing <code className="inline">dapp.origin</code>
							</td>
							<td>
								<code className="inline">dapp.origin</code> must be a valid
								HTTPS URL
							</td>
						</tr>
						<tr>
							<td>
								<code className="inline">exp</code> too far ahead
							</td>
							<td>More than 1 hour from the current time</td>
						</tr>
						<tr>
							<td>Callback not HTTPS</td>
							<td>
								Production callbacks must be{" "}
								<code className="inline">https://</code>; only{" "}
								<code className="inline">http://localhost</code> and{" "}
								<code className="inline">http://127.0.0.1</code> are allowed for
								dev
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 id="trust-levels">Trust levels recap</h2>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Level</th>
							<th>Blocks?</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code className="inline">legacy_unverified</code>
							</td>
							<td>No — shown with a warning badge</td>
						</tr>
						<tr>
							<td>
								<code className="inline">signed_untrusted</code>
							</td>
							<td>No — valid signature, issuer not in user's registry</td>
						</tr>
						<tr>
							<td>
								<code className="inline">verified_registry</code>
							</td>
							<td>No — fully verified</td>
						</tr>
						<tr>
							<td>
								<code className="inline">signature_invalid</code>
							</td>
							<td>Yes — proof present but signature check failed</td>
						</tr>
						<tr>
							<td>
								<code className="inline">registry_revoked</code>
							</td>
							<td>Yes</td>
						</tr>
						<tr>
							<td>
								<code className="inline">registry_origin_mismatch</code>
							</td>
							<td>Yes — registered issuer but wrong origin</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 id="without-sdk">Without the SDK</h2>
			<p>
				If you'd rather not add a dependency, the whole protocol fits in a
				handful of lines.
			</p>
			<CodeBlock html={manualBuildHtml} label="TYPESCRIPT" />
		</div>
	);
}
