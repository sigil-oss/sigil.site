import { usePostHog } from "@posthog/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Footer } from "#/components/Footer";
import { Nav } from "#/components/Nav";
import {
	fetchReleaseData,
	formatBytes,
	formatDownloads,
	RELEASES_FALLBACK,
	type GHAsset,
} from "#/lib/github";

export const Route = createFileRoute("/download")({
	head: () => ({
		meta: [
			{ title: "Download Sigil" },
			{
				name: "description",
				content:
					"Download Sigil for Mac, Windows, or Linux. Free, open source, no signups.",
			},
		],
	}),
	loader: () => fetchReleaseData(),
	staleTime: 5 * 60 * 1000,
	component: DownloadPage,
});

type OS = "mac" | "windows" | "linux";

function detectOS(): OS | null {
	if (typeof navigator === "undefined") return null;
	const ua = navigator.userAgent;
	if (ua.includes("Mac")) return "mac";
	if (ua.includes("Win")) return "windows";
	if (ua.includes("Linux") || ua.includes("X11")) return "linux";
	return null;
}

const firedDownloads = new Set<string>();

const LINUX_EXTRAS = [
	{ key: "deb" as const, note: ".deb — Debian / Ubuntu · update via apt" },
	{
		key: "rpm" as const,
		note: ".rpm — Fedora / RHEL / openSUSE · update via dnf",
	},
];

function DownloadPage() {
	const release = Route.useLoaderData();
	const posthog = usePostHog();
	const [detectedOS, setDetectedOS] = useState<OS | null>(null);

	useEffect(() => {
		setDetectedOS(detectOS());
	}, []);

	const track = (platform: string) => {
		const key = `${platform}:download_page`;
		if (firedDownloads.has(key)) return;
		firedDownloads.add(key);
		posthog.capture("download_clicked", {
			platform,
			location: "download_page",
			version: release.version,
		});
	};

	const platforms: Record<
		OS,
		{ asset: GHAsset | null; label: string; symbol: string; note: string }
	> = {
		mac: {
			asset: release.mac,
			label: "macOS",
			symbol: "⌘",
			note: "Apple Silicon + Intel · drag to Applications",
		},
		windows: {
			asset: release.windows,
			label: "Windows",
			symbol: "⊞",
			note: "Windows 10 or newer · runs the installer",
		},
		linux: {
			asset: release.appimage,
			label: "Linux",
			symbol: "⌂",
			note: "AppImage · auto-updates · runs anywhere",
		},
	};

	const os = detectedOS ?? "mac";
	const primary = platforms[os];
	const others = (Object.entries(platforms) as [OS, (typeof platforms)[OS]][]).filter(
		([k]) => k !== os,
	);

	return (
		<>
			<Nav />
			<div className="dl-page">
				<div className="wrap">
					{/* Hero */}
					<div className="dl-hero">
						<div className="dl-eyebrow">
							{detectedOS
								? `[ DETECTED · ${primary.label.toUpperCase()} ]`
								: "[ CHOOSE YOUR PLATFORM ]"}
						</div>
						<h1 className="dl-title">
							Download <span className="doto">SIGIL</span>
						</h1>
						<p className="dl-sub">
							Free forever · open source · no signups · keys never leave your
							machine
						</p>

						{/* Stats row */}
						<div className="dl-stats">
							{release.version && (
								<div className="dl-stat">
									<span className="dl-stat-val">{release.version}</span>
									<span className="dl-stat-label">LATEST</span>
								</div>
							)}
							{release.totalDownloads > 0 && (
								<div className="dl-stat">
									<span className="dl-stat-val">
										{formatDownloads(release.totalDownloads)}
									</span>
									<span className="dl-stat-label">DOWNLOADS</span>
								</div>
							)}
							<div className="dl-stat">
								<span className="dl-stat-val">3</span>
								<span className="dl-stat-label">PLATFORMS</span>
							</div>
							<div className="dl-stat">
								<span className="dl-stat-val">FREE</span>
								<span className="dl-stat-label">ALWAYS</span>
							</div>
						</div>
					</div>

					{/* Primary download */}
					<div className="dl-primary">
						<div className="dl-primary-symbol">{primary.symbol}</div>
						<div className="dl-primary-info">
							<div className="dl-primary-label">{primary.label}</div>
							<div className="dl-primary-note">
								{primary.asset?.name ?? "—"}
								{primary.asset &&
									` · ${formatBytes(primary.asset.size)}`}
								{" · "}
								{primary.note}
							</div>
						</div>
						<a
							className="btn primary dl-primary-btn"
							href={
								primary.asset?.browser_download_url ??
								RELEASES_FALLBACK
							}
							download={primary.asset?.name}
							onClick={() => track(os)}
						>
							<span>
								{primary.asset
									? `Download ${formatBytes(primary.asset.size)}`
									: "Download"}
							</span>
							<span className="arrow">↓</span>
						</a>
					</div>

					{/* Linux extras */}
					{os === "linux" && (
						<div className="dl-extras">
							{LINUX_EXTRAS.map(({ key, note }) => {
								const asset = release[key];
								return (
									<a
										key={key}
										className="dl-extra-row"
										href={
											asset?.browser_download_url ??
											RELEASES_FALLBACK
										}
										download={asset?.name}
										onClick={() => track(`linux-${key}`)}
									>
										<span className="dl-extra-file">
											{asset?.name ?? key.toUpperCase()}
										</span>
										<span className="dl-extra-note">{note}</span>
										<span className="dl-extra-size">
											{asset ? formatBytes(asset.size) : ""}
										</span>
										<span className="dl-extra-arrow">↓</span>
									</a>
								);
							})}
						</div>
					)}

					{/* Other platforms */}
					<div className="dl-others-label">Other platforms</div>
					<div className="dl-others">
						{others.map(([key, p]) => (
							<a
								key={key}
								className="dl-other"
								href={
									p.asset?.browser_download_url ?? RELEASES_FALLBACK
								}
								download={p.asset?.name}
								onClick={() => track(key)}
							>
								<span className="dl-other-symbol">{p.symbol}</span>
								<div className="dl-other-info">
									<span className="dl-other-label">{p.label}</span>
									<span className="dl-other-file">
										{p.asset?.name ?? "—"}
									</span>
									<span className="dl-other-note">{p.note}</span>
								</div>
								<span className="dl-other-size">
									{p.asset ? formatBytes(p.asset.size) : ""}
								</span>
								<span className="dl-other-arrow">↓</span>
							</a>
						))}
					</div>

					{/* Notes */}
					<div className="dl-notes">
						<div className="dl-note">
							<span className="dl-note-key">[ UPDATES ]</span>
							<span className="dl-note-val">
								AppImage and the macOS/Windows installers update
								automatically in-app. deb and rpm update through your
								package manager.
							</span>
						</div>
						<div className="dl-note">
							<span className="dl-note-key">[ VERIFY ]</span>
							<span className="dl-note-val">
								Every release is signed. Checksums and signatures are in
								the{" "}
								<a
									className="dl-inline-link"
									href={RELEASES_FALLBACK}
									target="_blank"
									rel="noopener noreferrer"
								>
									release notes
								</a>
								.
							</span>
						</div>
						<div className="dl-note">
							<span className="dl-note-key">[ SOURCE ]</span>
							<span className="dl-note-val">
								<a
									className="dl-inline-link"
									href="https://github.com/sigil-oss/sigil.app"
									target="_blank"
									rel="noopener noreferrer"
								>
									github.com/sigil-oss/sigil.app
								</a>{" "}
								— build from source with{" "}
								<code>bun run tauri build</code>.
							</span>
						</div>
					</div>

					{/* Footer nav */}
					<div className="dl-meta">
						<Link to="/" className="dl-meta-link">
							← Back to site
						</Link>
						<Link to="/docs" className="dl-meta-link">
							Integration docs →
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
