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
	const label = typeof q.label === "string" ? q.label.slice(0, 50) : "";

	const isValid = to.length === 60 && /^[A-Z]+$/.test(to);
	const short = isValid ? `${to.slice(0, 14)}…${to.slice(-12)}` : null;
	const amtNum = amount ? parseInt(amount, 10) : Number.NaN;
	const amtLabel = Number.isFinite(amtNum) && amtNum > 0 ? `${amtNum.toLocaleString("en")} QU` : null;

	const fonts = await getFonts();
	const W = 2400;
	const H = 1260;

	// ── Top bar ──────────────────────────────────────────────────────────────
	const topBar = container({
		tw: "flex flex-col w-full",
		children: [
			container({
				tw: "flex flex-row items-center justify-between w-full mb-10",
				children: [
					text({ text: "[ PAYMENT REQUEST ]", tw: "text-[28px] text-[#E0479E] tracking-[0.22em] font-bold" }),
					container({
						tw: "flex flex-row items-center",
						children: [
							text({ text: "[", tw: "text-[28px] font-bold text-[#E0479E] tracking-tight" }),
							container({ tw: "w-3 h-3 bg-[#E0479E] mx-2", children: [] }),
							text({ text: "] SIGIL", tw: "text-[28px] font-bold text-[#2a2a2a] tracking-[0.2em]" }),
						],
					}),
				],
			}),
			// Separator
			container({ tw: "w-full h-px bg-[#1c1c1c]", children: [] }),
		],
	});

	// ── Main block ───────────────────────────────────────────────────────────
	const mainBlock = container({
		tw: "flex flex-col",
		children: [
			// Amount — giant, fills most of width
			...(amtLabel
				? [text({ text: amtLabel, tw: "text-[196px] font-bold text-[#4ade80] tracking-[-0.04em] leading-none mb-6" })]
				: [text({ text: "OPEN IN SIGIL", tw: "text-[96px] font-bold text-[#242424] tracking-[0.04em] leading-none mb-6" })]),
			// Label
			...(label
				? [container({
						tw: "flex flex-row items-center mb-6",
						children: [
							container({ tw: "w-3 h-10 bg-[#E0479E] mr-8 flex-shrink-0", children: [] }),
							text({ text: label, tw: "text-[50px] text-[#787878] tracking-[0.01em]" }),
						],
					})]
				: []),
			// Address
			...(short
				? [container({
						tw: "flex flex-row items-center",
						children: [
							container({ tw: "w-3 h-8 bg-[#242424] mr-8 flex-shrink-0", children: [] }),
							text({ text: short, tw: "text-[32px] text-[#3e3e3e] tracking-[0.06em]" }),
						],
					})]
				: []),
		],
	});

	// ── Bottom bar ───────────────────────────────────────────────────────────
	const bottomBar = container({
		tw: "flex flex-row items-center justify-between w-full",
		children: [
			container({
				tw: "flex flex-row items-center",
				children: [
					container({
						tw: "flex flex-row items-center mr-12",
						children: [
							text({ text: "[", tw: "text-[34px] font-bold text-[#E0479E] tracking-tight" }),
							container({ tw: "w-4 h-4 bg-[#E0479E] mx-2", children: [] }),
							text({ text: "]", tw: "text-[34px] font-bold text-[#E0479E] tracking-tight" }),
						],
					}),
					text({ text: "SIGIL WALLET", tw: "text-[26px] font-bold text-[#303030] tracking-[0.28em]" }),
				],
			}),
			container({
				tw: "flex flex-row items-center",
				children: [
					text({ text: "sigilwallet.org", tw: "text-[26px] text-[#2e2e2e] tracking-[0.08em]" }),
					text({ text: " /pay", tw: "text-[26px] text-[#E0479E] tracking-[0.08em] font-bold" }),
				],
			}),
		],
	});

	const root = container({
		tw: "flex flex-row w-full h-full bg-[#080808]",
		children: [
			// Left magenta accent bar
			container({ tw: "w-8 h-full bg-[#E0479E] flex-shrink-0", children: [] }),
			// Main content
			container({
				tw: "flex flex-col flex-1 h-full justify-between px-80 pt-52 pb-52",
				children: [topBar, mainBlock, bottomBar],
			}),
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
