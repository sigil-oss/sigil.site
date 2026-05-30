import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const URI_SHAPE = `sigil://v1/request?d=<base64url-encoded JSON envelope>
                   [&cb=<optional HTTPS callback URL>]`;

const ENVELOPE_SHAPE = `interface SigilEnvelope {
  request: SigilRequest;   // discriminated union on "type"
  callback?: string | null;
  proof?: {
    version: 1;
    algorithm: "ES256";
    issuer: string;
    key_id?: string;
    payload_hash: string;
    signature: string;
    public_jwk?: JsonWebKey;
  };
}`;

export const Route = createFileRoute("/docs/")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — Overview & Protocol" },
			{
				name: "description",
				content:
					"How the Sigil deep-link protocol works: URI shape, envelope format, and end-to-end signing flow.",
			},
		],
	}),
	loader: async () => {
		const [uriHtml, envelopeHtml] = await Promise.all([
			hl(URI_SHAPE, "text"),
			hl(ENVELOPE_SHAPE, "typescript"),
		]);
		return { uriHtml, envelopeHtml };
	},
	component: DocsOverview,
});

function DocsOverview() {
	const { uriHtml, envelopeHtml } = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ DOCS · v1 · 2026 ]</div>
			<h1>
				Integrate <span className="doto">SIGIL</span>
				<br />
				in your app.
			</h1>
			<p>
				Sigil is a desktop wallet. Your frontend asks it to sign things over a{" "}
				<code className="inline">sigil://</code> URI. Sigil pops up, the user
				reviews and approves, then Sigil POSTs the signed result to a callback
				URL you control. That's the whole interface.
			</p>
			<p>
				The quickest path is the official{" "}
				<a
					className="doc-link"
					href="https://github.com/sigil-oss/sigil.connect"
					target="_blank"
					rel="noopener noreferrer"
				>
					@sigil-oss/connect
				</a>{" "}
				SDK — it builds envelopes, signs them, and parses callbacks. Or build
				the URI yourself; the protocol fits in a single fetch call.
			</p>

			<div className="callout info">
				<div className="callout-tag">[ SOURCE OF TRUTH ]</div>
				<p>
					Everything below is derived from the Rust validator at{" "}
					<code className="inline">src-tauri/src/deep_link.rs</code> and the Zod
					schema at <code className="inline">src/lib/request-schema.ts</code>.
					If these docs and the code disagree, the code wins.
				</p>
			</div>

			<h2 id="protocol">The protocol</h2>
			<p>
				Sigil registers the <code className="inline">sigil://</code> scheme with
				the OS. Opening a <code className="inline">sigil://v1/request</code> URL
				brings Sigil to the foreground — or launches it — with your request
				queued.
			</p>
			<CodeBlock html={uriHtml} label="URI SHAPE" />
			<ul className="brief">
				<li>
					Scheme must be <code className="inline">sigil</code>; host must be{" "}
					<code className="inline">v1</code>; path must be{" "}
					<code className="inline">/request</code>
				</li>
				<li>
					<code className="inline">d</code> = base64url (no padding) of a JSON{" "}
					<strong>envelope</strong>:{" "}
					<code className="inline">{"{ request, callback?, proof? }"}</code>
				</li>
				<li>
					Callback can be in the envelope's{" "}
					<code className="inline">callback</code> field or as{" "}
					<code className="inline">&amp;cb=</code> — both present means they
					must match
				</li>
				<li>Envelope max size: 8 192 bytes base64</li>
			</ul>

			<h2 id="envelope">Envelope shape</h2>
			<CodeBlock html={envelopeHtml} label="TYPESCRIPT" />

			<h2 id="flow">End-to-end flow</h2>
			<ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
				<li>
					<strong>Build the envelope:</strong>{" "}
					<code className="inline">
						{"{ request: { type, nonce, dapp, …fields }, callback? }"}
					</code>
				</li>
				<li>
					<strong>Base64url-encode</strong> (no padding), put it in{" "}
					<code className="inline">?d=</code>.
				</li>
				<li>
					<strong>Open the URI</strong> —{" "}
					<code className="inline">window.location.href = uri</code> in
					browsers; <code className="inline">open</code> /{" "}
					<code className="inline">xdg-open</code> /{" "}
					<code className="inline">start</code> from native apps.
				</li>
				<li>
					<strong>Sigil validates</strong> in Rust, queues the request, and
					shows it to the user.
				</li>
				<li>
					<strong>User approves or rejects.</strong> Sigil POSTs the result to
					your callback from the Rust layer.
				</li>
			</ol>

			<div className="callout info">
				<div className="callout-tag">[ LOCKED WALLET ]</div>
				<p>
					If the wallet is locked when a request arrives, Sigil holds it in the
					queue. After the user unlocks, Sigil routes directly to the request
					review screen — the request is not lost.
				</p>
			</div>
		</div>
	);
}
