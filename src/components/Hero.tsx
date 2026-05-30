import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";

export function Hero() {
	const posthog = usePostHog();

	return (
		<div className="wrap">
			<header className="hero">
				<div className="hero-grid">
					<div className="hero-copy">
						<div className="hero-eyebrow">
							<span className="dot" />
							<span>QUBIC DESKTOP WALLET · MAC · WINDOWS · LINUX</span>
						</div>
						<h1 className="hero-title">
							The <span className="doto">QUBIC</span>
							<br />
							<span className="signature">desktop wallet.</span>
						</h1>
						<p className="hero-tag">
							Sigil is a native app for Qubic.{" "}
							<strong>
								Send, receive, stake with Qearn, and sign contract calls
							</strong>{" "}
							— plus a deep-link protocol so any web app can request your
							approval.
						</p>
						<div className="hero-actions">
							<Link
								className="btn primary"
								to="/download"
								onClick={() =>
									posthog.capture("hero_cta_clicked", { location: "hero" })
								}
							>
								<span>Download</span>
								<span className="arrow">→</span>
							</Link>
							<a
								className="btn secondary"
								href="https://github.com/sigil-oss/sigil.app"
								target="_blank"
								rel="noopener noreferrer"
								onClick={() =>
									posthog.capture("source_code_clicked", { location: "hero" })
								}
							>
								<span>View source</span>
							</a>
						</div>
						<div className="hero-byline">
							<span>OPEN SOURCE</span>
							<span className="dot" />
							<span>MIT</span>
							<span className="dot" />
							<span>BUILT FOR QUBIC</span>
						</div>
					</div>

					<div className="hero-visual" aria-hidden="true">
						<svg
							viewBox="0 0 1024 1024"
							xmlns="http://www.w3.org/2000/svg"
							role="img"
						>
							<title>Sigil block mark — decorative</title>
							<g fill="var(--text-disabled)" opacity="0.18">
								<circle cx="192" cy="352" r="3" />
								<circle cx="352" cy="192" r="3" />
								<circle cx="512" cy="192" r="3" />
								<circle cx="672" cy="192" r="3" />
								<circle cx="832" cy="192" r="3" />
								<circle cx="192" cy="512" r="3" />
								<circle cx="832" cy="352" r="3" />
								<circle cx="352" cy="512" r="3" />
								<circle cx="832" cy="512" r="3" />
								<circle cx="192" cy="672" r="3" />
								<circle cx="352" cy="672" r="3" />
								<circle cx="512" cy="672" r="3" />
								<circle cx="832" cy="672" r="3" />
								<circle cx="192" cy="832" r="3" />
								<circle cx="352" cy="832" r="3" />
								<circle cx="512" cy="832" r="3" />
								<circle cx="672" cy="832" r="3" />
							</g>
							<g fill="var(--text-display)">
								<rect
									className="cell"
									x="132"
									y="132"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "0ms" }}
								/>
								<rect
									className="cell"
									x="292"
									y="292"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "80ms" }}
								/>
								<rect
									className="cell"
									x="132"
									y="452"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "160ms" }}
								/>
								<rect
									className="cell"
									x="292"
									y="452"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "240ms" }}
								/>
								<rect
									className="cell"
									x="612"
									y="452"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "320ms" }}
								/>
								<rect
									className="cell"
									x="612"
									y="612"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "480ms" }}
								/>
								<rect
									className="cell"
									x="772"
									y="772"
									width="120"
									height="120"
									rx="20"
									ry="20"
									style={{ animationDelay: "560ms" }}
								/>
							</g>
							<rect
								className="cell key-cell"
								x="442"
								y="442"
								width="140"
								height="140"
								rx="24"
								ry="24"
								fill="var(--error)"
								style={{ animationDelay: "400ms" }}
							/>
						</svg>
					</div>
				</div>

				<div className="hero-meta">
					<div className="cell">
						<div className="label">PLATFORMS</div>
						<div className="val">
							MAC<span className="sub">+ WIN + LINUX</span>
						</div>
					</div>
					<div className="cell">
						<div className="label">PROTOCOL</div>
						<div className="val">
							sigil://<span className="sub">/ DEEP-LINK</span>
						</div>
					</div>
					<div className="cell">
						<div className="label">STAKING</div>
						<div className="val">
							QEARN<span className="sub">/ BUILT-IN</span>
						</div>
					</div>
					<div className="cell">
						<div className="label">LICENSE</div>
						<div className="val">
							OPEN<span className="sub">/ SOURCE / MIT</span>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}
