import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const ENCODE_FN = `function b64url(str: string): string {
  return btoa(str)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function buildSigilUri(request: SigilRequest, callback?: string): string {
  // Wrap in the envelope — callback lives here, not as a query param
  const envelope = { request, callback: callback ?? null };
  const d = b64url(JSON.stringify(envelope));
  return \`sigil://v1/request?d=\${d}\`;
}`;

const REJECT_CB = `{
  "status": "rejected",
  "type": "<original request type>",
  "nonce": "<the nonce you sent>",
  "reason": "user_rejected"
}`;

export const Route = createFileRoute("/docs/payload")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — Payload Format & Callback" },
			{
				name: "description",
				content:
					"Required fields for every Sigil request, how to encode the URI, and how Sigil delivers callback results.",
			},
		],
	}),
	loader: async () => {
		const [encodeFnHtml, rejectCbHtml] = await Promise.all([
			hl(ENCODE_FN, "typescript"),
			hl(REJECT_CB, "json"),
		]);
		return { encodeFnHtml, rejectCbHtml };
	},
	component: PayloadPage,
});

function PayloadPage() {
	const { encodeFnHtml, rejectCbHtml } = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ PAYLOAD FORMAT ]</div>
			<h1>
				Payload format
				<br />
				&amp; callback
			</h1>

			<h2 id="payload">Required fields</h2>
			<p>
				The <code className="inline">d</code> parameter encodes a JSON envelope.
				The <code className="inline">request</code> object inside it requires
				these fields on every type:
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
								One of <code className="inline">connect</code>,{" "}
								<code className="inline">transfer</code>,{" "}
								<code className="inline">sc_call</code>,{" "}
								<code className="inline">sign_message</code>,{" "}
								<code className="inline">verify_message</code>
							</td>
						</tr>
						<tr>
							<td>
								nonce <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								16–128 chars, alphanumeric or{" "}
								<code className="inline">-_=+</code>. Must be unique — Sigil
								tracks seen nonces for 1 hour and rejects replays
							</td>
						</tr>
						<tr>
							<td>
								dapp.origin <span className="req">*</span>
							</td>
							<td>string</td>
							<td>
								Must be a valid <strong>HTTPS</strong> URL, e.g.{" "}
								<code className="inline">https://yourapp.example</code>
							</td>
						</tr>
						<tr>
							<td>dapp.name</td>
							<td>string</td>
							<td>Display name shown to the user. Strongly recommended</td>
						</tr>
						<tr>
							<td>dapp.icon</td>
							<td>string</td>
							<td>URL to the dApp's icon. Optional</td>
						</tr>
						<tr>
							<td>exp</td>
							<td>integer</td>
							<td>
								Unix seconds. Defaults to 5 min from receipt if omitted. Max 1
								hour from now — requests further out are rejected
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 id="encoding">Encoding the URI</h2>
			<p>
				Encode the <strong>envelope</strong> (not just the request) with
				URL-safe base64, no padding.
			</p>
			<CodeBlock html={encodeFnHtml} label="TYPESCRIPT" />

			<h2 id="delivery">Receiving the result</h2>
			<p>
				Two delivery modes are available. Set one or both in the envelope — they
				are independent and can be combined.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Field</th>
							<th>How it works</th>
							<th>Best for</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code className="inline">callback</code>
							</td>
							<td>
								Sigil POSTs the result as JSON from the Rust layer after the
								user acts
							</td>
							<td>
								Apps with a server — production dApps, anything that handles
								money or needs server-side nonce verification
							</td>
						</tr>
						<tr>
							<td>
								<code className="inline">redirect_uri</code>
							</td>
							<td>
								Sigil opens{" "}
								<code className="inline">
									redirect_uri?result=&lt;base64url JSON&gt;
								</code>{" "}
								in the default browser after the user acts
							</td>
							<td>
								Static sites, SPAs, and tools with no server — read{" "}
								<code className="inline">
									new URLSearchParams(location.search).get("result")
								</code>{" "}
								client-side
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h3 id="callback">callback — server POST</h3>
			<p>
				Sigil POSTs a JSON body to your callback URL from the Rust layer. If
				delivery fails, the result stays recoverable in request history for
				retry, JSON export, or clipboard copy.
			</p>

			<h4>Constraints</h4>
			<ul className="brief">
				<li>
					Must be <code className="inline">https://</code> in production
				</li>
				<li>
					<code className="inline">http://localhost</code> and{" "}
					<code className="inline">http://127.0.0.1</code> are allowed for local
					dev
				</li>
				<li>Private / loopback addresses are blocked (except localhost)</li>
			</ul>

			<h3 id="redirect-uri">redirect_uri — client redirect</h3>
			<p>
				Sigil opens{" "}
				<code className="inline">redirect_uri?result=&lt;value&gt;</code> in the
				browser after the user acts. The <code className="inline">result</code>{" "}
				query parameter is the same JSON response body as the POST callback,
				base64url-encoded (no padding). Read it client-side — no server
				required.
			</p>
			<ul className="brief">
				<li>
					Same URL constraints as <code className="inline">callback</code>:
					HTTPS in production, localhost HTTP for dev
				</li>
				<li>
					The result is visible in the browser URL bar and history — do not use
					for high-value transactions where the signed result must stay private
				</li>
				<li>
					Reject responses are also delivered via redirect so the dApp can
					handle both outcomes
				</li>
			</ul>

			<h3>If the user rejects</h3>
			<CodeBlock
				html={rejectCbHtml}
				label="POST ‹callback› or ?result= ‹redirect_uri›"
			/>

			<div className="callout warn">
				<div className="callout-tag">[ ALWAYS VERIFY THE NONCE ]</div>
				<p>
					Match the <code className="inline">nonce</code> in the callback body
					against the one you sent. Different nonce = different request. Don't
					trust the body until that matches.
				</p>
			</div>

			<h3>Trust levels</h3>
			<p>
				Requests can be unsigned (
				<code className="inline">legacy_unverified</code> — dApp name/origin are
				self-reported) or carry an ES256 <code className="inline">proof</code>.
				If a proof is present but the signature is invalid, or the issuer's
				origin doesn't match, Sigil blocks approval entirely. See the{" "}
				<a className="doc-link" href="/docs/sdk">
					@sigil-oss/connect SDK
				</a>{" "}
				page for how to sign requests.
			</p>
			<div className="fields-wrap">
				<table className="fields">
					<thead>
						<tr>
							<th>Level</th>
							<th>Meaning</th>
							<th>Blocks?</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code className="inline">legacy_unverified</code>
							</td>
							<td>No proof — dApp name/origin self-reported</td>
							<td>No</td>
						</tr>
						<tr>
							<td>
								<code className="inline">signed_untrusted</code>
							</td>
							<td>Valid ES256 signature, issuer not in user's registry</td>
							<td>No</td>
						</tr>
						<tr>
							<td>
								<code className="inline">verified_registry</code>
							</td>
							<td>Signature valid, issuer in registry, origin matches</td>
							<td>No</td>
						</tr>
						<tr>
							<td>
								<code className="inline">signature_invalid</code>
							</td>
							<td>Proof present but signature verification failed</td>
							<td>Yes</td>
						</tr>
						<tr>
							<td>
								<code className="inline">registry_revoked</code>
							</td>
							<td>Issuer in registry but marked revoked</td>
							<td>Yes</td>
						</tr>
						<tr>
							<td>
								<code className="inline">registry_origin_mismatch</code>
							</td>
							<td>
								Issuer registered but{" "}
								<code className="inline">dapp.origin</code> doesn't match
								trusted origins
							</td>
							<td>Yes</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
