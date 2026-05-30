import { usePostHog } from "@posthog/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Footer } from "#/components/Footer";
import { Nav } from "#/components/Nav";

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
	component: DownloadPage,
});

type OS = "mac" | "windows" | "linux";

const RELEASES = "https://github.com/sigil-oss/sigil.app/releases/latest";

const PLATFORMS: {
	os: OS;
	label: string;
	symbol: string;
	file: string;
	note: string;
}[] = [
	{
		os: "mac",
		label: "macOS",
		symbol: "⌘",
		file: "Sigil.dmg",
		note: "Apple Silicon + Intel · drag to Applications",
	},
	{
		os: "windows",
		label: "Windows",
		symbol: "⊞",
		file: "Sigil-setup.exe",
		note: "Windows 10 or newer · runs the installer",
	},
	{
		os: "linux",
		label: "Linux",
		symbol: "⌂",
		file: "Sigil.AppImage",
		note: "AppImage · auto-updates · runs anywhere",
	},
];

const LINUX_EXTRAS = [
	{ file: "Sigil.deb", note: ".deb — Debian / Ubuntu · update via apt" },
	{
		file: "Sigil.rpm",
		note: ".rpm — Fedora / RHEL / openSUSE · update via dnf",
	},
];

function detectOS(): OS | null {
	if (typeof navigator === "undefined") return null;
	const ua = navigator.userAgent;
	if (ua.includes("Mac")) return "mac";
	if (ua.includes("Win")) return "windows";
	if (ua.includes("Linux") || ua.includes("X11")) return "linux";
	return null;
}

// Module-level set — no duplicate download events per platform per session
const firedDownloads = new Set<string>();

function DownloadPage() {
	const posthog = usePostHog();
	const [detectedOS, setDetectedOS] = useState<OS | null>(null);

	useEffect(() => {
		setDetectedOS(detectOS());
	}, []);

	const track = (platform: string, location = "download_page") => {
		const key = `${platform}:${location}`;
		if (firedDownloads.has(key)) return;
		firedDownloads.add(key);
		posthog.capture("download_clicked", { platform, location });
	};

	const primary = PLATFORMS.find((p) => p.os === detectedOS) ?? PLATFORMS[0];
	const others = PLATFORMS.filter((p) => p.os !== primary.os);

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
					</div>

					{/* Primary download */}
					<div className="dl-primary">
						<div className="dl-primary-symbol">{primary.symbol}</div>
						<div className="dl-primary-info">
							<div className="dl-primary-label">{primary.label}</div>
							<div className="dl-primary-note">{primary.note}</div>
						</div>
						<a
							className="btn primary dl-primary-btn"
							href={RELEASES}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => track(primary.os)}
						>
							<span>{primary.file}</span>
							<span className="arrow">↓</span>
						</a>
					</div>

					{/* Linux extras */}
					{primary.os === "linux" && (
						<div className="dl-extras">
							{LINUX_EXTRAS.map(({ file, note }) => (
								<a
									key={file}
									className="dl-extra-row"
									href={RELEASES}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => track(`linux-${file.split(".").pop()}`)}
								>
									<span className="dl-extra-file">{file}</span>
									<span className="dl-extra-note">{note}</span>
									<span className="dl-extra-arrow">↓</span>
								</a>
							))}
						</div>
					)}

					{/* Other platforms */}
					<div className="dl-others-label">Other platforms</div>
					<div className="dl-others">
						{others.map(({ os, label, symbol, file, note }) => (
							<a
								key={os}
								className="dl-other"
								href={RELEASES}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => track(os)}
							>
								<span className="dl-other-symbol">{symbol}</span>
								<div className="dl-other-info">
									<span className="dl-other-label">{label}</span>
									<span className="dl-other-file">{file}</span>
									<span className="dl-other-note">{note}</span>
								</div>
								<span className="dl-other-arrow">↓</span>
							</a>
						))}
					</div>

					{/* Notes */}
					<div className="dl-notes">
						<div className="dl-note">
							<span className="dl-note-key">[ UPDATES ]</span>
							<span className="dl-note-val">
								AppImage and the macOS/Windows installers update automatically
								in-app. deb and rpm update through your package manager.
							</span>
						</div>
						<div className="dl-note">
							<span className="dl-note-key">[ VERIFY ]</span>
							<span className="dl-note-val">
								Every release is signed. Checksums and signatures are in the{" "}
								<a
									className="dl-inline-link"
									href={RELEASES}
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
								— build from source with <code>bun run tauri build</code>.
							</span>
						</div>
					</div>

					{/* Build metadata */}
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
