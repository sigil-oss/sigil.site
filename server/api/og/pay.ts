import { defineEventHandler, getQuery } from "h3";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import satori, { type SatoriOptions } from "satori";

type VNode = {
	type: string;
	props: Record<string, unknown> & { children?: VNode | VNode[] | string };
};

function box(
	style: Record<string, unknown>,
	children: (VNode | string | false | null | undefined)[] | string,
): VNode {
	return {
		type: "div",
		props: {
			style: { display: "flex", ...style },
			children: Array.isArray(children) ? (children.filter(Boolean) as VNode[]) : children,
		},
	};
}

function span(style: Record<string, unknown>, content: string): VNode {
	return { type: "span", props: { style, children: content } };
}

// Module-level cache
let wasmInited = false;
let fontRegular: ArrayBuffer | null = null;
let fontBold: ArrayBuffer | null = null;

async function ensureWasm() {
	if (wasmInited) return;
	await initWasm(fetch("https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm"));
	wasmInited = true;
}

async function getFonts() {
	if (fontRegular && fontBold) return;
	const base = "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/files/";
	[fontRegular, fontBold] = await Promise.all([
		fetch(`${base}jetbrains-mono-latin-400-normal.woff`).then((r) => r.arrayBuffer()),
		fetch(`${base}jetbrains-mono-latin-700-normal.woff`).then((r) => r.arrayBuffer()),
	]);
}

export default defineEventHandler(async (event) => {
	const q = getQuery(event);
	const to = typeof q.to === "string" ? q.to.toUpperCase() : "";
	const amount = typeof q.amount === "string" ? q.amount : "";
	const label = typeof q.label === "string" ? q.label.slice(0, 72) : "";

	const isValid = to.length === 60 && /^[A-Z]+$/.test(to);
	const short = isValid ? `${to.slice(0, 10)}…${to.slice(-8)}` : null;
	const amtNum = amount ? parseInt(amount, 10) : Number.NaN;
	const amtLabel =
		Number.isFinite(amtNum) && amtNum > 0 ? `${amtNum.toLocaleString("en")} QU` : null;

	await Promise.all([ensureWasm(), getFonts()]);

	const W = 1200;
	const H = 630;
	const ACCENT = "#4ade80";
	const BG = "#080808";

	const root = box(
		{
			flexDirection: "column",
			width: "100%",
			height: "100%",
			background: BG,
			padding: "72px 80px 60px",
			fontFamily: "JetBrains Mono",
			color: "#e8e8e8",
		},
		[
			// Brand eyebrow
			span(
				{ fontSize: 13, color: "#333", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 40 },
				"[ SIGIL WALLET ]",
			),
			// Main headline
			span(
				{ fontSize: 46, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", marginBottom: 24, lineHeight: 1.1 },
				"PAYMENT REQUEST",
			),
			// Address
			short
				? span({ fontSize: 20, color: "#505050", letterSpacing: "0.06em", marginBottom: amtLabel || label ? 44 : 0 }, short)
				: span({ fontSize: 20, color: "#3a3a3a", letterSpacing: "0.06em", marginBottom: 0 }, "INVALID LINK"),
			// Amount — large accent
			amtLabel
				? span({
						fontSize: 58,
						fontWeight: 700,
						color: ACCENT,
						letterSpacing: "-0.01em",
						marginBottom: label ? 18 : 0,
					}, amtLabel)
				: false,
			// Label / note
			label
				? box({ alignItems: "center" }, [
						span({ fontSize: 15, color: "#444", marginRight: 10 }, "//"),
						span({ fontSize: 22, color: "#888" }, label),
					])
				: false,
			// Footer
			box(
				{ marginTop: "auto", justifyContent: "space-between", alignItems: "flex-end", width: "100%" },
				[
					span({ fontSize: 12, color: "#252525", letterSpacing: "0.18em" }, "sigilwallet.org"),
					span({ fontSize: 12, color: "#252525", letterSpacing: "0.18em" }, "QUBIC"),
				],
			),
		],
	);

	const satoriOpts: SatoriOptions = {
		width: W,
		height: H,
		fonts: [
			{ name: "JetBrains Mono", data: fontRegular!, weight: 400, style: "normal" },
			{ name: "JetBrains Mono", data: fontBold!, weight: 700, style: "normal" },
		],
	};

	// biome-ignore lint/suspicious/noExplicitAny: satori accepts VNode-shaped objects matching ReactNode structure
	const svg = await satori(root as any, satoriOpts);

	const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();

	return new Response(png.buffer as ArrayBuffer, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
});
