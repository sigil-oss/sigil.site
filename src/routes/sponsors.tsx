import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "#/components/Footer";
import { Nav } from "#/components/Nav";

export const Route = createFileRoute("/sponsors")({
	head: () => ({
		meta: [
			{ title: "Sigil — Sponsors" },
			{
				name: "description",
				content:
					"Sigil is free and open source. Support development by donating QUBIC directly on-chain.",
			},
		],
	}),
	component: SponsorsPage,
});

const DONATION_IDENTITY =
	"UVYAOYTNYCRBVFBHNFIJUEOUEPEDIDUWWEAXKFSJEBJVASCQEROJOVOEEATL";

function SponsorsPage() {
	return (
		<>
			<Nav />
			<div className="sp-page">
				<div className="wrap">
					{/* Hero */}
					<div className="sp-hero">
						<div className="sp-eyebrow">[ SUPPORT SIGIL ]</div>
						<h1 className="sp-title">
							Free to use.
							<br />
							<span className="doto">Open</span> to support.
						</h1>
						<p className="sp-sub">
							Sigil is built in the open, charges nothing, and keeps no
							analytics on your keys. If it's useful to you, the best way to say
							thanks is to send some QU directly on-chain — no middlemen, no
							subscriptions, no promises beyond keeping the wallet good.
						</p>
					</div>

					{/* Donation address */}
					<div className="sp-address-card">
						<div className="sp-address-label">
							<span className="sp-address-tag">[ DONATION ADDRESS ]</span>
							<span className="sp-address-note">
								Any QU sent here is tracked on-chain and credited to your
								address in the sponsors list.
							</span>
						</div>
						<div className="sp-address-value">{DONATION_IDENTITY}</div>
						<button
							type="button"
							className="sp-copy-btn"
							onClick={() => {
								navigator.clipboard
									.writeText(DONATION_IDENTITY)
									.catch(() => {});
							}}
						>
							COPY ADDRESS
						</button>
					</div>

					{/* How to donate */}
					<div className="sp-how">
						<div className="sp-section-label">[ HOW TO DONATE ]</div>
						<div className="sp-steps">
							<div className="sp-step">
								<div className="sp-step-num">01</div>
								<div className="sp-step-h">Open Sigil</div>
								<p className="sp-step-b">
									Make sure your wallet is unlocked and you have some QU to
									send.
								</p>
							</div>
							<div className="sp-step">
								<div className="sp-step-num">02</div>
								<div className="sp-step-h">Go to Send</div>
								<p className="sp-step-b">
									Paste the address above into the recipient field. Any amount
									is welcome.
								</p>
							</div>
							<div className="sp-step">
								<div className="sp-step-num">03</div>
								<div className="sp-step-h">Confirm and sign</div>
								<p className="sp-step-b">
									Review the transaction, sign it, and you're done. The chain
									does the rest.
								</p>
							</div>
							<div className="sp-step">
								<div className="sp-step-num">04</div>
								<div className="sp-step-h">Optional: add your name</div>
								<p className="sp-step-b">
									Open a PR on the{" "}
									<a
										href="https://github.com/sigil-oss/sigil.app"
										target="_blank"
										rel="noopener noreferrer"
										className="sp-inline-link"
									>
										GitHub repo
									</a>{" "}
									to add a display name to your address in{" "}
									<code>sponsor-names.json</code>.
								</p>
							</div>
						</div>
					</div>

					{/* Sponsors list */}
					<div className="sp-list-wrap">
						<div className="sp-section-label">[ CURRENT SPONSORS ]</div>
						<SponsorsEmptyState />
					</div>

					{/* Transparency note */}
					<div className="sp-transparency">
						<div className="sp-transparency-label">[ TRANSPARENCY ]</div>
						<p className="sp-transparency-body">
							Every donation to the address above is a public on-chain
							transaction — verifiable by anyone on the Qubic network. There is
							no company, no legal entity, and no off-chain payment processor
							involved. Funds go directly to the wallet controlled by the
							maintainer and are used for development costs, tooling, and
							infrastructure. There is no commitment to specific deliverables in
							exchange for donations.
						</p>
						<div className="sp-transparency-links">
							<a
								href={`https://explorer.qubic.org/network/address/${DONATION_IDENTITY}`}
								target="_blank"
								rel="noopener noreferrer"
								className="sp-transparency-link"
							>
								View on Qubic Explorer ↗
							</a>
							<a
								href="https://github.com/sigil-oss/sigil.app/blob/main/sponsor-names.json"
								target="_blank"
								rel="noopener noreferrer"
								className="sp-transparency-link"
							>
								sponsor-names.json ↗
							</a>
						</div>
					</div>

					<div className="dl-meta">
						<Link to="/" className="dl-meta-link">
							← Back to site
						</Link>
						<Link to="/download" className="dl-meta-link">
							Download Sigil →
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

function SponsorsEmptyState() {
	return (
		<div className="sp-empty">
			<div className="sp-empty-mark">
				<svg
					viewBox="0 0 120 120"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<title>empty</title>
					<rect
						x="10"
						y="10"
						width="28"
						height="28"
						rx="6"
						fill="var(--border-strong)"
					/>
					<rect
						x="46"
						y="46"
						width="28"
						height="28"
						rx="6"
						fill="var(--error)"
						opacity="0.5"
					/>
					<rect
						x="82"
						y="82"
						width="28"
						height="28"
						rx="6"
						fill="var(--border-strong)"
					/>
				</svg>
			</div>
			<div className="sp-empty-title">No sponsors yet</div>
			<p className="sp-empty-sub">
				Be the first to support Sigil. Donations of any size show up here once
				the transaction confirms on-chain.
			</p>
		</div>
	);
}
