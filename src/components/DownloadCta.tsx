import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";

export function DownloadCta() {
	const posthog = usePostHog();

	return (
		<div className="download-cta-wrap">
			<div className="wrap">
				<div className="download-cta-inner">
					<div className="download-cta-copy">
						<div className="section-eyebrow">[ 05 / GET IT ]</div>
						<h2 className="download-cta-title">One file. No accounts.</h2>
						<p className="download-cta-sub">
							Mac, Windows, Linux — updates ship inside the app when they're
							ready.
						</p>
					</div>
					<div className="download-cta-actions">
						<Link
							to="/download"
							className="btn primary download-cta-btn"
							onClick={() =>
								posthog.capture("download_cta_clicked", {
									location: "home_section",
								})
							}
						>
							<span>Download for free</span>
							<span className="arrow">↓</span>
						</Link>
						<a
							href="https://github.com/sigil-oss/sigil.app/releases"
							target="_blank"
							rel="noopener noreferrer"
							className="btn secondary"
							onClick={() =>
								posthog.capture("external_link_clicked", {
									location: "download_cta",
									link: "all_releases",
								})
							}
						>
							All releases
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
