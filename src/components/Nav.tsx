import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";

export function Nav() {
	const posthog = usePostHog();

	const track = (section: string) =>
		posthog.capture("nav_link_clicked", { section });

	return (
		<nav>
			<div className="nav-inner">
				<Link className="nav-brand" to="/">
					<img src="/favicon.svg" alt="Sigil" />
					<span className="name">SIGIL</span>
				</Link>
				<div className="nav-links">
					{/* biome-ignore lint/a11y/useValidAnchor: valid href present; onClick is analytics-only */}
					<a href="/#features" onClick={() => track("features")}>
						Features
					</a>
					{/* biome-ignore lint/a11y/useValidAnchor: valid href present; onClick is analytics-only */}
					<a href="/#deeplink" onClick={() => track("apps")}>
						Apps
					</a>
					{/* biome-ignore lint/a11y/useValidAnchor: valid href present; onClick is analytics-only */}
					<a href="/#security" onClick={() => track("security")}>
						Trust
					</a>
					<Link to="/docs" onClick={() => track("docs")}>
						Docs
					</Link>
					<Link to="/brand" onClick={() => track("brand")}>
						Brand
					</Link>
					<Link to="/sponsors" onClick={() => track("sponsors")}>
						Sponsors
					</Link>
					<Link
						to="/download"
						className="cta"
						onClick={() => track("download")}
					>
						Download
					</Link>
				</div>
			</div>
		</nav>
	);
}
