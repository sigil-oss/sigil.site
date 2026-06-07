import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/brand")({
	head: () => ({
		meta: [
			{ title: "Sigil Brand Kit — Logos, Marks & Assets" },
			{
				name: "description",
				content:
					"The complete Sigil identity system. Block mark, avatars, social banners, typography, color palette, and usage rules. Free to use under MIT.",
			},
			{
				property: "og:title",
				content: "Sigil Brand Kit — Logos, Marks & Assets",
			},
			{
				property: "og:description",
				content:
					"The complete Sigil identity system. Block mark, avatars, social banners, typography, color palette, and usage rules.",
			},
			{ property: "og:url", content: "https://sigilwallet.org/brand" },
			{
				property: "og:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
			{
				name: "twitter:title",
				content: "Sigil Brand Kit — Logos, Marks & Assets",
			},
			{
				name: "twitter:description",
				content:
					"The complete Sigil identity system. Block mark, avatars, social banners, typography, color palette, and usage rules.",
			},
			{
				name: "twitter:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
		],
		links: [{ rel: "canonical", href: "https://sigilwallet.org/brand" }],
	}),
	component: BrandPage,
});

const FILES = [
	["SVG", "/brand/source/icon-dark.svg", "Primary mark · dark"],
	["SVG", "/brand/source/icon-light.svg", "Primary mark · light"],
	[
		"SVG",
		"/brand/source/icon-auto.svg",
		"System-adaptive (CSS prefers-color-scheme)",
	],
	["SVG", "/brand/source/icon-mono-white.svg", "White mark · transparent bg"],
	["SVG", "/brand/source/icon-mono-black.svg", "Black mark · transparent bg"],
	["SVG", "/brand/source/icon-rounded-dark.svg", "Squircle-masked · dark"],
	["SVG", "/brand/source/icon-rounded-light.svg", "Squircle-masked · light"],
	[
		"SVG",
		"/brand/source/wordmark-dark.svg",
		"Dot-matrix SIGIL wordmark · dark",
	],
	[
		"SVG",
		"/brand/source/wordmark-light.svg",
		"Dot-matrix SIGIL wordmark · light",
	],
	[
		"SVG",
		"/brand/source/lockup-horizontal-dark.svg",
		"Horizontal lockup · dark",
	],
	["SVG", "/brand/source/lockup-stacked-dark.svg", "Stacked lockup · dark"],
	["PNG", "/brand/app-icons/dark/icon-1024.png", "App icon · dark · 1024px"],
	["PNG", "/brand/app-icons/light/icon-1024.png", "App icon · light · 1024px"],
	[
		"PNG",
		"/brand/avatars/avatar-1024-dark.png",
		"Squircle avatar · 1024 · dark",
	],
	["PNG", "/brand/banners/og-image-dark.png", "OG image · 1200×630 · dark"],
	[
		"PNG",
		"/brand/banners/twitter-header-dark.png",
		"Twitter header · 1500×500 · dark",
	],
	[
		"PNG",
		"/brand/banners/github-banner-dark.png",
		"GitHub social · 1280×640 · dark",
	],
	["PNG", "/brand/banners/hero-dark.png", "Hero · 1920×1080 · dark"],
] as const;

function BrandPage() {
	return (
		<>
			<div className="brand-topbar">
				<div className="brand-topbar-inner">
					<Link to="/" className="brand-topbar-brand">
						<img src="/favicon.svg" alt="" />
						<span className="name">SIGIL · BRAND KIT</span>
					</Link>
					<div className="brand-topbar-meta">
						<span className="dot" />
						v1.0 · 2026
					</div>
				</div>
			</div>

			{/* Hero */}
			<div className="brand-wrap">
				<header className="brand-hero">
					<div className="brand-hero-eyebrow">[ BRAND KIT · 01 ]</div>
					<h1 className="brand-hero-title">
						Sigil is a wallet —<br />
						and a <span className="doto">SIGNATURE</span>.
					</h1>
					<p className="brand-hero-sub">
						A complete identity system for the Sigil desktop wallet. Monochrome,
						mechanical, precision-instrument. Built to live next to terminals
						and waveform displays — not lifestyle apps.
					</p>
					<div className="brand-hero-meta">
						<div className="brand-meta-cell">
							<div className="label">SYSTEM</div>
							<div className="value">v1.0 — STABLE</div>
						</div>
						<div className="brand-meta-cell">
							<div className="label">PRIMITIVES</div>
							<div className="value">15 ASSETS · 50+ FILES</div>
						</div>
						<div className="brand-meta-cell">
							<div className="label">SCHEME</div>
							<div className="value">SYSTEM AUTO</div>
						</div>
						<div className="brand-meta-cell">
							<div className="label">LICENSE</div>
							<div className="value">MIT</div>
						</div>
					</div>
				</header>
			</div>

			{/* 01 — The Mark */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 01 / THE MARK ]</div>
						<h2 className="brand-section-title">Block Sigil</h2>
						<p className="brand-section-sub">
							An asymmetric 5×5 block pattern — a custom wallet fingerprint
							built from the brand's rounded-rect vocabulary. Seven white cells
							and one red center cell as the "key" point.
						</p>
					</div>
					<div className="mark-trio">
						<div className="mark-card dark">
							<span className="label">[ 01.1 / DARK ]</span>
							<img
								src="/brand/app-icons/dark/icon-1024.png"
								alt="Sigil mark — dark"
							/>
						</div>
						<div className="mark-card system">
							<span className="label">[ 01.2 / SYSTEM ]</span>
							<img
								src="/brand/app-icons/dark/icon-1024.png"
								alt="Sigil mark — system"
							/>
						</div>
						<div className="mark-card light">
							<span className="label">[ 01.3 / LIGHT ]</span>
							<img
								src="/brand/app-icons/light/icon-1024.png"
								alt="Sigil mark — light"
							/>
						</div>
					</div>
				</section>
			</div>

			{/* 02 — Size ladder */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 02 / APP ICON ]</div>
						<h2 className="brand-section-title">Across all sizes</h2>
						<p className="brand-section-sub">
							The mark holds from 16px to 1024px. Hairlines compress
							predictably; the gap between cells stays legible down to the
							smallest taskbar render.
						</p>
					</div>
					<div className="size-ladder">
						{([16, 32, 64, 128, 256, 512, 1024] as const).map((s) => (
							<div className="size-cell" key={s}>
								<img
									src={`/brand/app-icons/dark/icon-${s}.png`}
									width={Math.min(s, 260)}
									height={Math.min(s, 260)}
									alt=""
									style={{ borderRadius: 10, background: "#000" }}
								/>
								<span className="label">{s}</span>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* 03 — Avatars */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 03 / AVATARS ]</div>
						<h2 className="brand-section-title">Squircle-masked</h2>
						<p className="brand-section-sub">
							For social profiles, GitHub orgs, and OS app icons where the
							platform doesn't provide its own corner masking.
						</p>
					</div>
					<div className="avatar-grid">
						{[
							{ file: "avatar-1024-dark", label: "DARK · 1024" },
							{ file: "avatar-512-dark", label: "DARK · 512" },
							{ file: "avatar-1024-light", label: "LIGHT · 1024" },
							{ file: "avatar-512-light", label: "LIGHT · 512" },
						].map(({ file, label }) => (
							<div className="avatar-cell" key={file}>
								<img src={`/brand/avatars/${file}.png`} alt={label} />
								<div className="meta">
									<span>{label}</span>
									<span>PNG</span>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* 04 — Banners */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 04 / BANNERS ]</div>
						<h2 className="brand-section-title">Social + repo previews</h2>
						<p className="brand-section-sub">
							Horizontal lockup centered, framed by viewfinder brackets. Dark by
							default; light variants ship alongside.
						</p>
					</div>
					<div className="banner-grid">
						{[
							{ file: "og-image-dark", name: "OG IMAGE · 1200×630" },
							{
								file: "twitter-header-dark",
								name: "TWITTER HEADER · 1500×500",
							},
							{ file: "github-banner-dark", name: "GITHUB SOCIAL · 1280×640" },
							{ file: "hero-dark", name: "HERO · 1920×1080" },
						].map(({ file, name }) => (
							<div className="banner-preview" key={file}>
								<img src={`/brand/banners/${file}.png`} alt={name} />
								<div className="meta">
									<span className="name">{name}</span>
									<a href={`/brand/banners/${file}.png`} download>
										DOWNLOAD
									</a>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* 05 — Typography */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 05 / TYPOGRAPHY ]</div>
						<h2 className="brand-section-title">Three families, three roles</h2>
						<p className="brand-section-sub">
							Never more than two on one screen. Doto appears exactly once per
							context — the surprise moment.
						</p>
					</div>
					<div className="type-grid">
						<div className="type-cell">
							<div className="face face-grotesk">Aa</div>
							<div className="type-name">SPACE GROTESK</div>
							<div className="type-use">
								All UI text — headings, body, labels
							</div>
							<div
								className="alphabet"
								style={{ fontFamily: "'Space Grotesk', sans-serif" }}
							>
								ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
							</div>
						</div>
						<div className="type-cell">
							<div className="face face-mono">{"[ ]"}</div>
							<div className="type-name">SPACE MONO</div>
							<div className="type-use">
								Identities, hashes, status tags, technical data
							</div>
							<div
								className="alphabet"
								style={{ fontFamily: "'Space Mono', monospace" }}
							>
								{"ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 [ ]"}
							</div>
						</div>
						<div className="type-cell">
							<div className="face face-doto">S</div>
							<div className="type-name">DOTO</div>
							<div className="type-use">
								Hero moments only — wallet name, tick counter
							</div>
							<div
								className="alphabet"
								style={{
									fontFamily: "'Doto', monospace",
									fontWeight: 700,
									fontSize: 24,
									letterSpacing: "0.1em",
								}}
							>
								SIGIL
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* 06 — Color */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 06 / COLOR ]</div>
						<h2 className="brand-section-title">
							Monochrome canvas, encoded status
						</h2>
						<p className="brand-section-sub">
							Color carries data, not decoration. Status colors map to
							confirmed, pending, failed.
						</p>
					</div>
					<div className="color-grid">
						{[
							{
								bg: "#000",
								fg: "#FFF",
								border: "#1A1A1A",
								name: "OLED BLACK",
								hex: "#000000",
							},
							{
								bg: "#F5F3EF",
								fg: "#0A0A0A",
								border: undefined,
								name: "PAPER",
								hex: "#F5F3EF",
							},
							{
								bg: "#22C55E",
								fg: "#000",
								border: undefined,
								name: "SUCCESS",
								hex: "#22C55E",
							},
							{
								bg: "#F59E0B",
								fg: "#000",
								border: undefined,
								name: "WARNING",
								hex: "#F59E0B",
							},
							{
								bg: "#D71921",
								fg: "#FFF",
								border: undefined,
								name: "ERROR",
								hex: "#D71921",
							},
							{
								bg: "#909090",
								fg: "#000",
								border: undefined,
								name: "SECONDARY",
								hex: "#909090",
							},
						].map(({ bg, fg, border, name, hex }) => (
							<div
								className="swatch"
								key={hex}
								style={{ background: bg, color: fg, borderColor: border }}
							>
								<div className="name">{name}</div>
								<div className="hex">{hex}</div>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* 07 — Rules */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 07 / RULES ]</div>
						<h2 className="brand-section-title">Do / Don't</h2>
					</div>
					<div className="rules-grid">
						{[
							{
								do: true,
								text: "Keep the Block Sigil pattern intact. The 8 cells are positioned intentionally — don't rearrange.",
							},
							{
								do: false,
								text: "Don't add gradients, drop shadows, or glow effects. The mark is flat and high-contrast.",
							},
							{
								do: true,
								text: "Use the dark variant by default. Light variant for warm/paper backgrounds only.",
							},
							{
								do: false,
								text: "Don't change the accent color. Red is the key point of the sigil — not optional.",
							},
							{
								do: true,
								text: "Maintain at least one cell-width of clear space around the mark.",
							},
							{
								do: false,
								text: "Don't rotate, stretch, skew, or otherwise transform the mark.",
							},
						].map(({ do: isDo, text }) => (
							<div className={`rule ${isDo ? "do" : "dont"}`} key={text}>
								<div className="rule-tag">{isDo ? "[ DO ]" : "[ DON'T ]"}</div>
								<div className="text">{text}</div>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* 08 — File index */}
			<div className="brand-wrap">
				<section className="brand-section">
					<div className="brand-section-head">
						<div className="brand-section-num">[ 08 / FILE INDEX ]</div>
						<h2 className="brand-section-title">Per-platform exports</h2>
					</div>
					<div className="file-list">
						{FILES.map(([type, path, desc], i) => (
							<div className="file-row" key={path}>
								<span className="idx">{String(i + 1).padStart(2, "0")}</span>
								<span className="path">{path.replace("/brand/", "")}</span>
								<span className="desc">
									{type} — {desc}
								</span>
								<a href={path} download>
									SAVE
								</a>
							</div>
						))}
					</div>
				</section>
			</div>

			<div className="brand-wrap">
				<div className="brand-footer">
					<span>SIGIL BRAND KIT · v1.0</span>
					<span>BLOCK SIGIL · 2026</span>
				</div>
			</div>
		</>
	);
}
