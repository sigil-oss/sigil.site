import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";

export function Footer() {
	const posthog = usePostHog();

	return (
		<div className="wrap">
			<footer>
				<div className="footer-grid">
					<div className="footer-brand">
						<img src="/favicon.svg" alt="Sigil" />
						<div className="name">SIGIL</div>
						<p>
							A wallet for QUBIC that stays on your computer. Free, open source,
							and built so nobody can see your keys but you.
						</p>
					</div>
					<div className="footer-col">
						<h4>Product</h4>
						<a href="/#features">Features</a>
						<a href="/#deeplink">Deep linking</a>
						<a href="/#security">Security</a>
						<a href="/#download">Download</a>
					</div>
					<div className="footer-col">
						<h4>Build</h4>
						<Link to="/docs">Docs</Link>
						<a
							href="https://github.com/sigil-oss/sigil.app"
							target="_blank"
							rel="noopener noreferrer"
							onClick={() =>
								posthog.capture("external_link_clicked", {
									location: "footer",
									link: "github",
								})
							}
						>
							GitHub
						</a>
						<a
							href="https://github.com/sigil-oss/sigil.app/releases"
							target="_blank"
							rel="noopener noreferrer"
							onClick={() =>
								posthog.capture("external_link_clicked", {
									location: "footer",
									link: "changelog",
								})
							}
						>
							Changelog
						</a>
					</div>
					<div className="footer-col">
						<h4>Brand</h4>
						<Link to="/brand">Press kit</Link>
					</div>
				</div>
				<div className="footer-bottom">
					<span>© 2026 SIGIL · BUILT FOR QUBIC</span>
					<span>OPEN SOURCE</span>
				</div>
			</footer>
		</div>
	);
}
