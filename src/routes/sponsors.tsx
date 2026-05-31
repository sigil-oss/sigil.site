import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "#/components/Footer";
import { Identicon } from "#/components/Identicon";
import { Nav } from "#/components/Nav";
import {
	DONATION_IDENTITY,
	fetchSponsorData,
	formatQu,
	type Sponsor,
} from "#/lib/sponsors";

export const Route = createFileRoute("/sponsors")({
	head: () => ({
		meta: [
			{ title: "Sponsors — Support Sigil, the Open-Source QUBIC Wallet" },
			{
				name: "description",
				content:
					"Sigil is free and open source. Support development by sending QU directly on-chain — no accounts, no middlemen.",
			},
			{
				property: "og:title",
				content: "Sponsors — Support Sigil, the Open-Source QUBIC Wallet",
			},
			{
				property: "og:description",
				content:
					"Sigil is free and open source. Support development by sending QU directly on-chain — no accounts, no middlemen.",
			},
			{ property: "og:url", content: "https://sigilwallet.org/sponsors" },
			{
				property: "og:image",
				content: "https://sigilwallet.org/og-image-dark.png",
			},
			{
				name: "twitter:title",
				content: "Sponsors — Support Sigil, the Open-Source QUBIC Wallet",
			},
			{
				name: "twitter:description",
				content:
					"Sigil is free and open source. Support development by sending QU directly on-chain — no accounts, no middlemen.",
			},
			{
				name: "twitter:image",
				content: "https://sigilwallet.org/og-image-dark.png",
			},
		],
		links: [{ rel: "canonical", href: "https://sigilwallet.org/sponsors" }],
	}),
	loader: () => fetchSponsorData(),
	staleTime: 5 * 60 * 1000,
	component: SponsorsPage,
});

function SponsorsPage() {
	const { sponsors, totalQu, donationCount } = Route.useLoaderData();

	return (
		<>
			<Nav />
			<div className="sp-page">
				<div className="wrap">
					{/* Hero */}
					<div className="sp-hero">
						<div className="sp-eyebrow">[ SPONSORS ]</div>
						<h1 className="sp-title">
							Built in the open.
							<br />
							Kept alive by <span className="doto">you</span>.
						</h1>
						<p className="sp-sub">
							Sigil charges nothing and tracks nothing. If it saves you time or
							gives you peace of mind, you can say thanks directly on-chain — no
							accounts, no payment processors, no promises in return.
						</p>

						<div className="sp-stats-row">
							<div className="sp-stat-item">
								<span className="sp-stat-val">
									{sponsors.length > 0 ? sponsors.length : "—"}
								</span>
								<span className="sp-stat-label">SPONSORS</span>
							</div>
							<div className="sp-stat-sep" />
							<div className="sp-stat-item">
								<span className="sp-stat-val">
									{totalQu > 0 ? formatQu(totalQu) : "—"}
								</span>
								<span className="sp-stat-label">DONATED</span>
							</div>
							<div className="sp-stat-sep" />
							<div className="sp-stat-item">
								<span className="sp-stat-val">
									{donationCount > 0 ? donationCount : "—"}
								</span>
								<span className="sp-stat-label">TRANSACTIONS</span>
							</div>
							<div className="sp-stat-sep" />
							<div className="sp-stat-item">
								<span className="sp-stat-val">FREE</span>
								<span className="sp-stat-label">FOREVER</span>
							</div>
						</div>
					</div>

					{/* Donation address */}
					<AddressBlock />

					{/* Sponsors list */}
					<div className="sp-section">
						<div className="sp-section-eyebrow">[ WHO'S SUPPORTING ]</div>
						{sponsors.length > 0 ? (
							<SponsorList sponsors={sponsors} />
						) : (
							<SponsorsEmptyState />
						)}
					</div>

					{/* How it works */}
					<div className="sp-section">
						<div className="sp-section-eyebrow">[ HOW IT WORKS ]</div>
						<div className="sp-steps">
							<div className="sp-step">
								<div className="sp-step-num">01</div>
								<div className="sp-step-body">
									<div className="sp-step-h">Copy the address above</div>
									<p className="sp-step-b">
										One click — it's in your clipboard.
									</p>
								</div>
							</div>
							<div className="sp-step">
								<div className="sp-step-num">02</div>
								<div className="sp-step-body">
									<div className="sp-step-h">Open Sigil → Send</div>
									<p className="sp-step-b">
										Paste the address, enter an amount. Any size is appreciated.
									</p>
								</div>
							</div>
							<div className="sp-step">
								<div className="sp-step-num">03</div>
								<div className="sp-step-body">
									<div className="sp-step-h">Sign the transaction</div>
									<p className="sp-step-b">
										Review it, sign it, done. The chain handles the rest — no
										account needed.
									</p>
								</div>
							</div>
							<div className="sp-step">
								<div className="sp-step-num">04</div>
								<div className="sp-step-body">
									<div className="sp-step-h">Add your name (optional)</div>
									<p className="sp-step-b">
										Your address shows here by default. To use a name, open a PR
										to{" "}
										<a
											href="https://github.com/sigil-oss/sigil.app/blob/main/sponsor-names.json"
											target="_blank"
											rel="noopener noreferrer"
											className="sp-inline-link"
										>
											sponsor-names.json
										</a>
										.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Transparency */}
					<div className="sp-transparency">
						<div className="sp-transparency-row">
							<div className="sp-transparency-text">
								<div className="sp-transparency-label">
									[ ON-CHAIN · TRANSPARENT ]
								</div>
								<p className="sp-transparency-body">
									Every donation is a public Qubic transaction. No company, no
									legal entity, no escrow. Funds go to the maintainer's wallet
									and cover development costs and infrastructure. No
									deliverables are promised in exchange.
								</p>
							</div>
							<div className="sp-transparency-links">
								<a
									href={`https://explorer.qubic.org/network/address/${DONATION_IDENTITY}`}
									target="_blank"
									rel="noopener noreferrer"
									className="sp-transparency-link"
								>
									Qubic Explorer ↗
								</a>
								<a
									href="https://github.com/sigil-oss/sigil.app/blob/main/sponsor-names.json"
									target="_blank"
									rel="noopener noreferrer"
									className="sp-transparency-link"
								>
									sponsor-names.json ↗
								</a>
								<a
									href="https://github.com/sigil-oss/sigil.app"
									target="_blank"
									rel="noopener noreferrer"
									className="sp-transparency-link"
								>
									Source code ↗
								</a>
							</div>
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

function AddressBlock() {
	const [copied, setCopied] = useState(false);

	const copy = () => {
		navigator.clipboard.writeText(DONATION_IDENTITY).catch(() => {});
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Split into groups of 8 for readability
	const chunks = DONATION_IDENTITY.match(/.{1,8}/g) ?? [];

	return (
		<div className="sp-addr-block">
			<div className="sp-addr-top">
				<div className="sp-addr-meta">
					<span className="sp-addr-scheme">qubic://</span>
					<span className="sp-addr-title">Send QU to support Sigil</span>
				</div>
				<button
					type="button"
					className={`sp-addr-copy${copied ? " sp-addr-copied" : ""}`}
					onClick={copy}
				>
					{copied ? "COPIED ✓" : "COPY"}
				</button>
			</div>
			<div className="sp-addr-code">
				{chunks.map((chunk, i) => (
					<span
						key={chunk}
						className={`sp-addr-chunk${i % 2 === 0 ? "" : " sp-addr-chunk-dim"}`}
					>
						{chunk}
					</span>
				))}
			</div>
			<div className="sp-addr-hint">Open Sigil → Send → paste this address</div>
		</div>
	);
}

function SponsorList({ sponsors }: { sponsors: Sponsor[] }) {
	const podium = sponsors.slice(0, 3);
	const rest = sponsors.slice(3);

	// Podium order: #2 left, #1 centre (elevated), #3 right
	const podiumOrder = [podium[1], podium[0], podium[2]].filter(
		Boolean,
	) as Sponsor[];
	const podiumRanks = podiumOrder.map((sp) => sponsors.indexOf(sp));

	return (
		<div className="sp-list">
			{podium.length > 0 && (
				<div className="sp-podium">
					{podiumOrder.map((sp, displayIdx) => {
						const rank = podiumRanks[displayIdx];
						const isFirst = rank === 0;
						return (
							<div
								key={sp.identity}
								className={`sp-podium-slot${isFirst ? " sp-podium-first" : ""}`}
							>
								<div className={`sp-podium-badge sp-podium-badge-${rank + 1}`}>
									{String(rank + 1).padStart(2, "0")}
								</div>
								<Identicon
									seed={sp.identity}
									size={isFirst ? 72 : 56}
									radius={isFirst ? 18 : 14}
									className="sp-podium-identicon"
								/>
								<div className="sp-podium-name">{sp.name}</div>
								<div className="sp-podium-amount">{formatQu(sp.amountQu)}</div>
							</div>
						);
					})}
				</div>
			)}

			{rest.length > 0 && (
				<div className="sp-rest">
					{rest.map((sp, i) => (
						<div className="sp-row" key={sp.identity}>
							<span className="sp-row-rank">
								{String(i + 4).padStart(2, "0")}
							</span>
							<Identicon seed={sp.identity} size={36} radius={8} />
							<div className="sp-row-info">
								<span className="sp-row-name">{sp.name}</span>
								<span className="sp-row-identity">{sp.identity}</span>
							</div>
							<span className="sp-row-amount">{formatQu(sp.amountQu)}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function SponsorsEmptyState() {
	return (
		<div className="sp-empty">
			<div className="sp-empty-identicons">
				{["SEED_A_PLACEHOLDER", "SEED_B_PLACEHOLDER", "SEED_C_PLACEHOLDER"].map(
					(seed) => (
						<Identicon
							key={seed}
							seed={seed}
							size={48}
							radius={12}
							style={{ opacity: 0.25 }}
						/>
					),
				)}
			</div>
			<div className="sp-empty-title">No sponsors yet — be the first.</div>
			<p className="sp-empty-sub">
				Copy the address above, open Sigil, and send any amount. Your address
				will appear here once the transaction confirms.
			</p>
		</div>
	);
}
