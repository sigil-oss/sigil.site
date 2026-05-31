import { createServerFn } from "@tanstack/react-start";

const REPO = "sigil-oss/sigil.app";
const CACHE_TTL = 5 * 60 * 1000;
let _cache: { data: ReleaseData; at: number } | null = null;
const FALLBACK_URL = `https://github.com/${REPO}/releases/latest`;

export interface GHAsset {
	name: string;
	size: number;
	download_count: number;
	browser_download_url: string;
}

interface GHRelease {
	tag_name: string;
	published_at: string;
	assets: GHAsset[];
}

export interface ReleaseData {
	version: string;
	publishedAt: string;
	mac: GHAsset | null;
	windows: GHAsset | null;
	appimage: GHAsset | null;
	deb: GHAsset | null;
	rpm: GHAsset | null;
	totalDownloads: number;
	fallback: boolean;
}

export const fetchReleaseData = createServerFn().handler(
	async (): Promise<ReleaseData> => {
		const headers: Record<string, string> = {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "sigilwallet.org",
		};
		const token = process.env.GITHUB_TOKEN;
		if (token) headers.Authorization = `Bearer ${token}`;

		if (_cache && Date.now() - _cache.at < CACHE_TTL) return _cache.data;

		try {
			const [latestRes, allRes] = await Promise.all([
				fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
					headers,
				}),
				fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
					headers,
				}),
			]);

			if (!latestRes.ok) throw new Error(`GitHub API ${latestRes.status}`);

			const latest: GHRelease = await latestRes.json();
			const all: GHRelease[] = allRes.ok ? await allRes.json() : [];

			const assets = latest.assets ?? [];

			const totalDownloads = all.reduce(
				(sum, release) =>
					sum +
					release.assets
						.filter(
							(a) => !a.name.endsWith(".sig") && !a.name.endsWith(".json"),
						)
						.reduce((s, a) => s + a.download_count, 0),
				0,
			);

			const data: ReleaseData = {
				version: latest.tag_name ?? "",
				publishedAt: latest.published_at ?? "",
				mac: assets.find((a) => a.name.endsWith(".dmg")) ?? null,
				windows: assets.find((a) => a.name.endsWith("-setup.exe")) ?? null,
				appimage:
					assets.find(
						(a) => a.name.endsWith(".AppImage") && !a.name.endsWith(".sig"),
					) ?? null,
				deb: assets.find((a) => a.name.endsWith(".deb")) ?? null,
				rpm: assets.find((a) => a.name.endsWith(".rpm")) ?? null,
				totalDownloads,
				fallback: false,
			};
			_cache = { data, at: Date.now() };
			return data;
		} catch {
			return {
				version: "",
				publishedAt: "",
				mac: null,
				windows: null,
				appimage: null,
				deb: null,
				rpm: null,
				totalDownloads: 0,
				fallback: true,
			};
		}
	},
);

export const RELEASES_FALLBACK = FALLBACK_URL;

export function formatBytes(bytes: number): string {
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDownloads(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return String(n);
}
