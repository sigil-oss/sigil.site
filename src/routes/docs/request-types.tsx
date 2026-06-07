import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const CONNECT_REQ = `{
  "type": "connect",
  "nonce": "a1b2c3d4e5f6g7h8",
  "dapp": { "name": "Acme", "origin": "https://acme.example" },
  "permissions": ["transfer", "sign_message"]
}`;

const CONNECT_CB = `{
  "status": "connected",
  "type": "connect",
  "nonce": "a1b2c3d4e5f6g7h8",
  "identity": "<60-char Qubic identity>",
  "permissions": ["transfer", "sign_message"]
}`;

const TRANSFER_REQ = `{
  "type": "transfer",
  "nonce": "f3a8b2c1d0e9...",
  "dapp": { "name": "Acme", "origin": "https://acme.example" },
  "to": "NQZBXKZP4MTLDUVWXYZK8MFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "amount": 1500000
  // optional: "from": "<identity>", "tick_offset": 5
}`;

const TRANSFER_CB = `{
  "status": "signed",
  "type": "transfer",
  "nonce": "f3a8b2c1d0e9...",
  "identity": "<signing identity>",
  "tx_hash": "<transaction hash>",
  "target_tick": 14872123
}`;

const SC_CALL_REQ = `{
  "type": "sc_call",
  "nonce": "...",
  "dapp": { "name": "Acme", "origin": "https://acme.example" },
  "contract_index": 6,    // Qearn
  "input_type": 1,        // lock procedure
  "amount": 10000000
  // optional: "payload": "<base64 input bytes>", "from": "...", "tick_offset": 5
}`;

const SIGN_MSG_REQ = `{
  "type": "sign_message",
  "nonce": "...",
  "dapp": { "name": "Acme", "origin": "https://acme.example" },
  "message": "Sign in to Acme · 2026-05-30T10:00:00Z"
  // optional: "from": "<identity>", "data": "<extra string>"
  // max message length: 2 048 characters
}`;

const SIGN_MSG_CB = `{
  "status": "signed",
  "type": "sign_message",
  "nonce": "...",
  "identity": "<signing identity>",
  "signature": "<ECDSA signature, base64>",
  "public_key": "<public key, base64>"
}`;

const VERIFY_MSG_REQ = `{
  "type": "verify_message",
  "nonce": "...",
  "dapp": { "name": "Acme", "origin": "https://acme.example" },
  "message": "<original message>",
  "signature": "<signature to verify>",
  "public_key": "<public key>"
}`;

const VERIFY_MSG_CB = `{
  "status": "verified",
  "type": "verify_message",
  "nonce": "...",
  "valid": true,
  "identity": "<derived identity, or empty string>"
}`;

export const Route = createFileRoute("/docs/request-types")({
	head: () => ({
		meta: [
			{
				title:
					"Sigil Request Types — connect, transfer, sc_call, sign_message, verify_message",
			},
			{
				name: "description",
				content:
					"All five Sigil QUBIC request types: connect wallet, transfer QU, sc_call smart contracts, sign_message for auth, verify_message — fields, constraints, and callback shapes.",
			},
			{
				property: "og:title",
				content:
					"Sigil Request Types — connect, transfer, sc_call, sign_message, verify_message",
			},
			{
				property: "og:description",
				content:
					"All five Sigil request types with field definitions and callback shapes: connect wallet, transfer QU, smart contract calls, message signing and verification.",
			},
			{
				property: "og:url",
				content: "https://sigilwallet.org/docs/request-types",
			},
			{
				property: "og:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
			{
				name: "twitter:title",
				content:
					"Sigil Request Types — connect, transfer, sc_call, sign_message, verify_message",
			},
			{
				name: "twitter:description",
				content:
					"All five Sigil request types with field definitions and callback shapes: connect wallet, transfer QU, smart contract calls, message signing and verification.",
			},
			{
				name: "twitter:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
		],
		links: [
			{ rel: "canonical", href: "https://sigilwallet.org/docs/request-types" },
		],
	}),
	loader: async () => {
		const [
			connectReqHtml,
			connectCbHtml,
			transferReqHtml,
			transferCbHtml,
			scCallReqHtml,
			signMsgReqHtml,
			signMsgCbHtml,
			verifyMsgReqHtml,
			verifyMsgCbHtml,
		] = await Promise.all([
			hl(CONNECT_REQ, "json"),
			hl(CONNECT_CB, "json"),
			hl(TRANSFER_REQ, "json"),
			hl(TRANSFER_CB, "json"),
			hl(SC_CALL_REQ, "json"),
			hl(SIGN_MSG_REQ, "json"),
			hl(SIGN_MSG_CB, "json"),
			hl(VERIFY_MSG_REQ, "json"),
			hl(VERIFY_MSG_CB, "json"),
		]);
		return {
			connectReqHtml,
			connectCbHtml,
			transferReqHtml,
			transferCbHtml,
			scCallReqHtml,
			signMsgReqHtml,
			signMsgCbHtml,
			verifyMsgReqHtml,
			verifyMsgCbHtml,
		};
	},
	component: RequestTypesPage,
});

function RequestTypesPage() {
	const d = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ REQUEST TYPES ]</div>
			<h1>Request types</h1>
			<p>
				Five types are supported. Every request requires the common fields
				described on the{" "}
				<a className="doc-link" href="/docs/payload">
					Payload format
				</a>{" "}
				page, plus the type-specific fields below.
			</p>

			{/* connect */}
			<h2 id="connect">connect</h2>
			<p>
				Ask the user to pair their wallet with your app and optionally pre-grant
				permissions so future requests of those types don't need per-call
				approval.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								type <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								<code className="inline">"connect"</code>
							</td>
						</tr>
						<tr>
							<td>permissions</td>
							<td>string[]</td>
							<td>
								Any subset of <code className="inline">"transfer"</code>,{" "}
								<code className="inline">"sc_call"</code>,{" "}
								<code className="inline">"sign_message"</code>. Omit to connect
								without pre-granting.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CodeBlock html={d.connectReqHtml} label="REQUEST" />
			<CodeBlock html={d.connectCbHtml} label="APPROVE CALLBACK" />

			{/* transfer */}
			<h2 id="transfer">transfer</h2>
			<p>
				Send an amount of QU from the user's selected account to a recipient.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								type <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								<code className="inline">"transfer"</code>
							</td>
						</tr>
						<tr>
							<td>
								to <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								Exactly 60 uppercase A–Z letters — Qubic identity format with
								checksum
							</td>
						</tr>
						<tr>
							<td>
								amount <span className="req">*</span>
							</td>
							<td>number | string</td>
							<td>Positive whole QU units</td>
						</tr>
						<tr>
							<td>from</td>
							<td>string</td>
							<td>Prefer a specific account identity. User can override.</td>
						</tr>
						<tr>
							<td>tick_offset</td>
							<td>integer</td>
							<td>Target tick offset from current. Advanced use.</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CodeBlock html={d.transferReqHtml} label="REQUEST" />
			<CodeBlock html={d.transferCbHtml} label="APPROVE CALLBACK" />

			{/* sc_call */}
			<h2 id="sc-call">sc_call</h2>
			<p>
				Call a Qubic smart contract procedure. Sigil constructs the invocation
				transaction and signs it.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								type <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								<code className="inline">"sc_call"</code>
							</td>
						</tr>
						<tr>
							<td>
								contract_index <span className="req">*</span>
							</td>
							<td>integer</td>
							<td>0–63</td>
						</tr>
						<tr>
							<td>
								input_type <span className="req">*</span>
							</td>
							<td>integer</td>
							<td>Non-negative. The procedure number on the contract.</td>
						</tr>
						<tr>
							<td>payload</td>
							<td>string</td>
							<td>
								Base64-encoded input bytes for the call (if the procedure takes
								input)
							</td>
						</tr>
						<tr>
							<td>amount</td>
							<td>number | string</td>
							<td>QU attached to the call, if any</td>
						</tr>
						<tr>
							<td>from</td>
							<td>string</td>
							<td>Prefer a specific account identity</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CodeBlock html={d.scCallReqHtml} label="REQUEST" />
			<p>
				The approve callback has the same shape as{" "}
				<code className="inline">transfer</code>:{" "}
				<code className="inline">
					{"{ status: 'signed', identity, tx_hash, target_tick }"}
				</code>
				.
			</p>

			{/* sign_message */}
			<h2 id="sign-message">sign_message</h2>
			<p>
				Ask the user to sign a message without sending a transaction. Useful for
				off-chain authentication, proving address ownership, or session tokens.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								type <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								<code className="inline">"sign_message"</code>
							</td>
						</tr>
						<tr>
							<td>
								message <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								Non-empty, max 2 048 characters. Shown verbatim to the user.
							</td>
						</tr>
						<tr>
							<td>from</td>
							<td>string</td>
							<td>Prefer a specific account identity</td>
						</tr>
						<tr>
							<td>data</td>
							<td>string</td>
							<td>
								Extra opaque string passed through to the callback. Not shown to
								the user.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CodeBlock html={d.signMsgReqHtml} label="REQUEST" />
			<CodeBlock html={d.signMsgCbHtml} label="APPROVE CALLBACK" />

			{/* verify_message */}
			<h2 id="verify-message">verify_message</h2>
			<p>
				Hand Sigil a message + signature + public key; get back whether the
				signature is valid. No private key is involved — Sigil just runs the
				verification math.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								type <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								<code className="inline">"verify_message"</code>
							</td>
						</tr>
						<tr>
							<td>
								message <span className="req">*</span>
							</td>
							<td>string</td>
							<td>The original message that was signed</td>
						</tr>
						<tr>
							<td>
								signature <span className="req">*</span>
							</td>
							<td>string</td>
							<td>The signature to verify</td>
						</tr>
						<tr>
							<td>
								public_key <span className="req">*</span>
							</td>
							<td>string</td>
							<td>The public key to verify against</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CodeBlock html={d.verifyMsgReqHtml} label="REQUEST" />
			<CodeBlock html={d.verifyMsgCbHtml} label="CALLBACK" />
		</div>
	);
}
