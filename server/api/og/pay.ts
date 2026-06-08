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
	const short = isValid ? `${to.slice(0, 12)}…${to.slice(-10)}` : null;
	const amtNum = amount ? parseInt(amount, 10) : Number.NaN;
	const amtLabel = Number.isFinite(amtNum) && amtNum > 0 ? `${amtNum.toLocaleString("en")} QU` : null;

	const fonts = await getFonts();
	const W = 2400;
	const H = 1260;

	// ── Top bar ─────────────────────────────────────────────────────────────
	const topBar = container({
		tw: "flex flex-row items-center justify-between w-full",
		children: [
			text({ text: "[ PAYMENT REQUEST ]", tw: "text-[30px] text-[#E0479E] tracking-[0.25em] font-bold" }),
			text({ text: "SIGIL", tw: "text-[30px] text-[#2e2e2e] tracking-[0.35em] font-bold" }),
		],
	});

	// ── Main block (amount or fallback) + address ────────────────────────────
	const mainBlock = container({
		tw: "flex flex-col",
		children: [
			// Amount — giant
			...(amtLabel
				? [text({ text: amtLabel, tw: "text-[172px] font-bold text-[#4ade80] tracking-[-0.04em] leading-none" })]
				: [text({ text: "OPEN IN SIGIL →", tw: "text-[80px] font-bold text-[#2e2e2e] tracking-[0.04em] leading-none" })]),
			// Label
			...(label
				? [container({
						tw: "flex flex-row items-center mt-10",
						children: [
							container({ tw: "w-3 h-9 bg-[#E0479E] mr-8 flex-shrink-0", children: [] }),
							text({ text: label, tw: "text-[46px] text-[#707070] tracking-[0.02em]" }),
						],
					})]
				: []),
			// Address
			container({
				tw: "flex flex-row items-center mt-8",
				children: [
					container({ tw: "w-3 h-7 bg-[#282828] mr-8 flex-shrink-0", children: [] }),
					text({
						text: short ?? "INVALID LINK",
						tw: `text-[30px] tracking-[0.06em] ${short ? "text-[#353535]" : "text-[#252525]"}`,
					}),
				],
			}),
		],
	});

	// ── Bottom bar ───────────────────────────────────────────────────────────
	const bottomBar = container({
		tw: "flex flex-row items-center justify-between w-full pt-16 border-t border-[#161616]",
		children: [
			container({
				tw: "flex flex-row items-center",
				children: [
					text({ text: "[", tw: "text-[36px] font-bold text-[#E0479E] tracking-[-0.05em]" }),
					container({ tw: "w-4 h-4 bg-[#E0479E] mx-3", children: [] }),
					text({ text: "]", tw: "text-[36px] font-bold text-[#E0479E] mr-10 tracking-[-0.05em]" }),
					text({ text: "SIGIL WALLET", tw: "text-[26px] font-bold text-[#2a2a2a] tracking-[0.25em]" }),
				],
			}),
			text({ text: "sigilwallet.org/pay", tw: "text-[26px] text-[#252525] tracking-[0.1em]" }),
		],
	});

	const root = container({
		tw: "flex flex-row w-full h-full bg-[#080808]",
		children: [
			// Left magenta accent bar
			container({ tw: "w-8 h-full bg-[#E0479E] flex-shrink-0", children: [] }),
			// Main content — justify-between distributes top/main/bottom across full height
			container({
				tw: "flex flex-col flex-1 justify-between px-80 pt-56 pb-56",
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
