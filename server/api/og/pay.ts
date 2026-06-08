import { defineEventHandler, getQuery } from "h3";
import { render } from "takumi-js";
import { googleFont, container, text } from "@takumi-rs/helpers";

type FontLoader = { name: string; key: string; weight: number | undefined; style: string | undefined; data: () => Promise<ArrayBuffer> };

let cachedFonts: FontLoader[] | null = null;

async function getFonts(): Promise<FontLoader[]> {
	if (cachedFonts) return cachedFonts;
	cachedFonts = await googleFont("Space Mono", { weight: [400, 700] });
	return cachedFonts;
}

export default defineEventHandler(async (event) => {
	const q = getQuery(event);
	const to = typeof q.to === "string" ? q.to.toUpperCase() : "";
	const amount = typeof q.amount === "string" ? q.amount : "";
	const label = typeof q.label === "string" ? q.label.slice(0, 44) : "";

	const isValid = to.length === 60 && /^[A-Z]+$/.test(to);
	const short = isValid ? `${to.slice(0, 14)}…${to.slice(-12)}` : "INVALID LINK";
	const amtNum = amount ? parseInt(amount, 10) : Number.NaN;
	const amtLabel = Number.isFinite(amtNum) && amtNum > 0 ? `${amtNum.toLocaleString("en")} QU` : null;

	const fonts = await getFonts();
	const W = 2400;
	const H = 1260;

	// ── Left column: all content ─────────────────────────────────────────────
	const leftCol = container({
		tw: "flex flex-col h-full justify-between py-52",
		style: { width: 1480, paddingLeft: 72, paddingRight: 64 },
		children: [
			// Header
			container({
				tw: "flex flex-col",
				children: [
					text({ text: "PAYMENT REQUEST", tw: "text-[26px] text-[#E0479E] tracking-[0.3em] font-bold mb-8" }),
					container({ style: { width: "100%", height: 2, background: "#E0479E" }, children: [] }),
				],
			}),
			// Amount
			container({
				tw: "flex flex-col",
				children: amtLabel
					? [text({ text: amtLabel, tw: "text-[200px] font-bold text-[#4ade80] tracking-[-0.04em] leading-none" })]
					: [text({ text: "OPEN IN SIGIL", tw: "text-[80px] font-bold text-[#242424] leading-none" })],
			}),
			// Label + address stacked
			container({
				tw: "flex flex-col",
				children: [
					...(label
						? [container({
								tw: "flex flex-row items-center mb-6",
								children: [
									container({ style: { width: 6, height: 44, background: "#E0479E", marginRight: 24, flexShrink: 0 }, children: [] }),
									text({ text: label, tw: "text-[44px] text-[#686868] tracking-[0.01em]" }),
								],
							})]
						: []),
					container({
						tw: "flex flex-row items-center",
						children: [
							container({ style: { width: 6, height: 32, background: "#2a2a2a", marginRight: 24, flexShrink: 0 }, children: [] }),
							text({ text: short, tw: "text-[30px] text-[#3a3a3a] tracking-[0.06em]" }),
						],
					}),
				],
			}),
			// Footer
			container({
				tw: "flex flex-row items-center justify-between",
				children: [
					container({
						tw: "flex flex-row items-center",
						children: [
							text({ text: "[", tw: "text-[30px] font-bold text-[#E0479E] tracking-tight" }),
							container({ style: { width: 12, height: 12, background: "#E0479E", margin: "0 8px" }, children: [] }),
							text({ text: "] SIGIL", tw: "text-[30px] font-bold text-[#282828] tracking-[0.2em]" }),
						],
					}),
					container({
						tw: "flex flex-row items-center",
						children: [
							text({ text: "sigilwallet.org", tw: "text-[24px] text-[#2e2e2e] tracking-[0.08em]" }),
							text({ text: "/pay", tw: "text-[24px] text-[#E0479E] tracking-[0.08em] font-bold" }),
						],
					}),
				],
			}),
		],
	});

	// ── Right column: decorative ─────────────────────────────────────────────
	// Vertical thin line + large ghosted "QU" as backdrop element
	const rightCol = container({
		tw: "flex flex-col items-center justify-center h-full",
		style: { width: 840, borderLeft: "2px solid #161616" },
		children: [
			text({ text: "QU", tw: "text-[320px] font-bold text-[#111111] tracking-[-0.06em] leading-none" }),
			text({ text: "QUBIC NETWORK", tw: "text-[20px] text-[#1a1a1a] tracking-[0.35em] mt-6" }),
		],
	});

	const root = container({
		tw: "flex flex-row w-full h-full bg-[#080808]",
		children: [
			// Left accent bar
			container({ style: { width: 8, height: "100%", background: "#E0479E", flexShrink: 0 }, children: [] }),
			leftCol,
			rightCol,
		],
	});

	const png = await render(root, { width: W, height: H, fonts });

	return new Response(png.buffer as ArrayBuffer, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
});
