import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Footer } from "#/components/Footer";
import { Nav } from "#/components/Nav";
import { Identicon } from "#/components/Identicon";

export const Route = createFileRoute("/pay")({
	validateSearch: (search: Record<string, unknown>) => ({
		to: typeof search.to === "string" ? search.to : "",
		amount: typeof search.amount === "string" ? search.amount : "",
		label: typeof search.label === "string" ? search.label : "",
	}),
	head: ({ match }) => {
		const { to, amount, label } = match.search;
		const shortId = to ? `${to.slice(0, 8)}…${to.slice(-6)}` : "";
		const amountLabel = amount ? `${Number(amount).toLocaleString()} QU` : "";
		const title = label
			? `${label} — Sigil Payment Request`
			: amountLabel
				? `Send ${amountLabel} — Sigil Payment Request`
				: shortId
					? `Payment request to ${shortId} — Sigil`
					: "Payment request — Sigil";
		const description = [
			label && `"${label}"`,
			amountLabel && `Amount: ${amountLabel}`,
			shortId && `To: ${shortId}`,
		]
			.filter(Boolean)
			.join(" · ");

		const ogParams = new URLSearchParams({ to });
		if (amount) ogParams.set("amount", amount);
		if (label) ogParams.set("label", label);
		const ogImage = `https://www.sigilwallet.org/api/og/pay?${ogParams.toString()}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: description || "Open this link in Sigil to send QUBIC." },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description || "Open this link in Sigil to send QUBIC." },
				{ property: "og:url", content: `https://sigilwallet.org/pay` },
				{ property: "og:image", content: ogImage },
				{ property: "og:image:width", content: "1200" },
				{ property: "og:image:height", content: "630" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description || "Open this link in Sigil to send QUBIC." },
				{ name: "twitter:image", content: ogImage },
			],
			links: [{ rel: "canonical", href: "https://www.sigilwallet.org/pay" }],
		};
	},
	component: PayPage,
});

function isValidIdentity(id: string): boolean {
	return id.length === 60 && /^[A-Z]+$/.test(id);
}

function formatAmount(raw: string): string {
	const n = parseInt(raw, 10);
	if (!n || n <= 0) return "";
	return n.toLocaleString("en") + " QU";
}

function PayPage() {
	const { to, amount, label } = Route.useSearch();
	const [opened, setOpened] = useState(false);
	const [copyDone, setCopyDone] = useState(false);

	const valid = isValidIdentity(to);
	const formattedAmount = formatAmount(amount);

	const params = new URLSearchParams({ to });
	if (amount) params.set("amount", amount);
	if (label) params.set("label", label);
	const deepLink = `sigil://pay?${params.toString()}`;
	const webLink = `https://sigilwallet.org/pay?${params.toString()}`;

	function openInSigil() {
		window.location.href = deepLink;
		setOpened(true);
	}

	async function copyLink() {
		await navigator.clipboard.writeText(webLink).catch(() => {});
		setCopyDone(true);
		setTimeout(() => setCopyDone(false), 1500);
	}

	// Auto-attempt to open Sigil on first load if valid
	useEffect(() => {
		if (valid) {
			const t = setTimeout(() => {
				window.location.href = deepLink;
			}, 600);
			return () => clearTimeout(t);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (!valid) {
		return (
			<>
				<Nav />
				<div className="pay-page">
					<div className="wrap">
						<div className="pay-card">
							<div className="pay-eyebrow">[ INVALID LINK ]</div>
							<p className="pay-error-msg">
								This payment link is missing or has an invalid recipient address.
							</p>
							<Link to="/download" className="btn primary">
								Download Sigil <span className="arrow">→</span>
							</Link>
						</div>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Nav />
			<div className="pay-page">
				<div className="wrap">
					<div className="pay-card">
						<div className="pay-eyebrow">[ PAYMENT REQUEST ]</div>

						{/* Identity block */}
						<div className="pay-identity">
							<Identicon seed={to} size={56} radius={12} />
							<div className="pay-identity-text">
								<div className="pay-identity-addr mono">
									{to.slice(0, 8)}…{to.slice(-8)}
								</div>
								<div className="pay-identity-full mono">{to}</div>
							</div>
						</div>

						{/* Amount + label */}
						{(formattedAmount || label) && (
							<div className="pay-details">
								{formattedAmount && (
									<div className="pay-detail-row">
										<span className="pay-detail-key mono">AMOUNT</span>
										<span className="pay-detail-val">{formattedAmount}</span>
									</div>
								)}
								{label && (
									<div className="pay-detail-row">
										<span className="pay-detail-key mono">NOTE</span>
										<span className="pay-detail-val">{label}</span>
									</div>
								)}
							</div>
						)}

						{/* CTA */}
						<div className="pay-actions">
							<button
								type="button"
								className="btn primary"
								onClick={openInSigil}
							>
								Open in Sigil <span className="arrow">→</span>
							</button>
							<button
								type="button"
								className="btn secondary"
								onClick={copyLink}
							>
								{copyDone ? "Copied ✓" : "Copy link"}
							</button>
						</div>

						{opened && (
							<div className="pay-notice mono">
								[ SIGIL SHOULD HAVE OPENED — IF NOT, INSTALL IT BELOW ]
							</div>
						)}

						<div className="pay-divider" />

						{/* Install nudge */}
						<div className="pay-install">
							<div className="pay-install-label mono">Don't have Sigil?</div>
							<p className="pay-install-sub">
								Sigil is a free, open-source QUBIC wallet for Mac, Windows, and
								Linux. Install it to send this payment.
							</p>
							<Link to="/download" className="btn secondary" style={{ alignSelf: "flex-start" }}>
								Download Sigil <span className="arrow">↓</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
