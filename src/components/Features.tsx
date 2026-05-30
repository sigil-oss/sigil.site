type TagVariant = "default" | "warn" | "info";

function Feature({
	num,
	title,
	body,
	tag,
	tagVariant = "default",
}: {
	num: string;
	title: string;
	body: string;
	tag: string;
	tagVariant?: TagVariant;
}) {
	return (
		<div className="feature">
			<span className="num">{num}</span>
			<h3 className="h">{title}</h3>
			<p className="b">{body}</p>
			<span
				className={`tag${tagVariant === "warn" ? " warn" : tagVariant === "info" ? " info" : ""}`}
			>
				{tag}
			</span>
		</div>
	);
}

export function Features() {
	return (
		<div className="wrap">
			<section id="features">
				<div className="section-eyebrow">[ 01 / WHAT IT DOES ]</div>
				<h2 className="section-title">
					Everything you'd expect.
					<br />
					Nothing you wouldn't.
				</h2>
				<p className="section-sub">
					Send, receive, stake, sign, organize. No filler, no upsells, no
					"premium" features behind a paywall. Here's the whole picture.
				</p>

				<div className="feature-group-title">[ MOVING MONEY ]</div>
				<div className="features">
					<Feature
						num="[ 01 ]"
						title="Send QUBIC"
						body="Type an address or pick from your contacts. Confirm the amount. Sign. Done."
						tag="[ ONE-STEP REVIEW ]"
					/>
					<Feature
						num="[ 02 ]"
						title="Receive QUBIC"
						body="Your address as a QR code, ready to share. Tap to copy — clears from your clipboard 30 seconds later."
						tag="[ AUTO-CLEAR CLIPBOARD ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 03 ]"
						title="Pay 25 people at once"
						body="Splitting a bill, paying contributors, sending airdrops — up to 25 addresses in a single transaction."
						tag="[ ONE TX · 25 RECIPIENTS ]"
					/>
					<Feature
						num="[ 04 ]"
						title="Contacts"
						body="Save addresses by name so you never paste the wrong one. One-click send to anyone in your book."
						tag="[ ONE-CLICK SEND ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 05 ]"
						title="Full history"
						body={
							'Every transaction you\'ve sent or received, with plain-English labels for contract calls like "QUtil · Send to Many."'
						}
						tag="[ SEARCH + FILTER ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 06 ]"
						title="Burn QUBIC"
						body="Permanently destroy QU — for protocol fees, contract operations, or just because. Two confirmations, no surprises."
						tag="[ IRREVERSIBLE ]"
						tagVariant="warn"
					/>
				</div>

				<div className="feature-group-title">[ EARN ]</div>
				<div className="features two">
					<Feature
						num="[ 07 ]"
						title="Stake with Qearn"
						body="Lock some QUBIC and earn rewards over time. Sigil shows the lock epoch, maturity date, and projected return before you commit."
						tag="[ QEARN BUILT-IN ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 08 ]"
						title="Unlock anytime"
						body="All your locked positions in one list. Mature ones unlock cleanly. Early unlocks warn you about forfeited rewards before you proceed."
						tag="[ HONEST WARNINGS ]"
						tagVariant="warn"
					/>
				</div>

				<div className="feature-group-title">[ ORGANIZE ]</div>
				<div className="features">
					<Feature
						num="[ 09 ]"
						title="Multiple wallets"
						body="Personal, savings, side project — separate encrypted wallets with separate passwords. Switch in one click."
						tag="[ UNLIMITED ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 10 ]"
						title="Multiple accounts"
						body="Each wallet can hold multiple accounts. One for spending, one for receiving, one for trading — your call."
						tag="[ COLOR-CODED ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 11 ]"
						title="Privacy mode"
						body="Hide every balance across every screen with one toggle. Numbers replaced with dots — same character count so nothing leaks."
						tag="[ ONE-CLICK SHIELD ]"
					/>
				</div>

				<div className="feature-group-title">[ CONNECT & SIGN ]</div>
				<div className="features">
					<Feature
						num="[ 12 ]"
						title="Connect to QUBIC apps"
						body="Any QUBIC web app or tool can ask Sigil to sign. You see exactly what they want before anything happens."
						tag="[ YOU SEE FIRST ]"
					/>
					<Feature
						num="[ 13 ]"
						title="Trust verification"
						body="Sigil evaluates each request: unverified (self-reported), signed by an unknown issuer, or fully verified against a trusted registry. Invalid signatures block approval entirely."
						tag="[ STAY ALERT ]"
						tagVariant="warn"
					/>
					<Feature
						num="[ 14 ]"
						title="Sign messages"
						body="Prove you own an address by signing a message — for logins, contract reviews, or just verifying identity."
						tag="[ NO PAYMENT NEEDED ]"
						tagVariant="info"
					/>
				</div>

				<div className="feature-group-title">[ SECURITY & UNLOCK ]</div>
				<div className="features">
					<Feature
						num="[ 15 ]"
						title="Touch ID, Windows Hello, OS keyring"
						body="Unlock with Touch ID on Mac, Windows Hello on Windows, or your OS credential store on Linux. Your password is managed by the OS — never stored by Sigil."
						tag="[ ALL THREE PLATFORMS ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 16 ]"
						title="Auto-lock"
						body="Idle timeout, laptop sleep, or window blur — Sigil locks on all three. Locking happens in the Rust layer; the renderer can't skip it."
						tag="[ AUTOMATIC ]"
						tagVariant="warn"
					/>
					<Feature
						num="[ 17 ]"
						title="Backup verification"
						body="When you create a wallet, Sigil quizzes you on 4 random positions of your recovery phrase before letting you continue."
						tag="[ NO SKIPPING ]"
					/>
				</div>

				<div className="feature-group-title">[ QUALITY OF LIFE ]</div>
				<div className="features">
					<Feature
						num="[ 18 ]"
						title="Desktop notifications"
						body="Get pinged when a transaction confirms, when someone sends you QU, or when a signature request comes in — even if Sigil is minimized."
						tag="[ NATIVE OS NOTIFS ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 19 ]"
						title="Make it yours"
						body="Pick a font, an accent color, a density. Stick to OLED black or warm paper, or let it follow your system. Sigil should feel like yours, not ours."
						tag="[ APPEARANCE SETTINGS ]"
						tagVariant="info"
					/>
					<Feature
						num="[ 20 ]"
						title="Auto-updates"
						body="New version shows up in Settings when ready. Click to install, live progress, app reopens itself when done."
						tag="[ SIGNED & VERIFIED ]"
					/>
					<Feature
						num="[ 21 ]"
						title="Global search"
						body="Search across accounts, contacts, transaction hashes, memos, and known contracts from anywhere in the app."
						tag="[ SEARCH EVERYWHERE ]"
						tagVariant="info"
					/>
				</div>
			</section>
		</div>
	);
}
