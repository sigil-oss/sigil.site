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

const HR = (color = "#202020") =>
	container({ tw: `w-full`, style: { height: 3, background: color, flexShrink: 0 }, children: [] });

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

	// Row 1 — header
	const header = container({
		tw: "flex flex-row items-center justify-between w-full",
		children: [
			text({ text: "PAYMENT REQUEST", tw: "text-[26px] text-[#E0479E] tracking-[0.3em] font-bold" }),
			container({
				tw: "flex flex-row items-center",
				children: [
					text({ text: "[", tw: "text-[26px] font-bold text-[#E0479E] tracking-tight" }),
					container({ tw: "w-3 h-3 bg-[#E0479E] mx-2 flex-shrink-0", children: [] }),
					text({ text: "] SIGIL", tw: "text-[26px] font-bold text-[#2a2a2a] tracking-[0.25em]" }),
				],
			}),
		],
	});

	// Row 2 — amount (giant, fills width)
	const amountRow = container({
		tw: "flex flex-col w-full",
		children: amtLabel
			? [text({ text: amtLabel, tw: "text-[220px] font-bold text-[#4ade80] tracking-[-0.04em] leading-none" })]
			: [text({ text: "OPEN IN SIGIL", tw: "text-[100px] font-bold text-[#242424] tracking-[0.04em] leading-none" })],
	});

	// Row 3 — label + address on same line
	const metaRow = container({
		tw: "flex flex-row items-center justify-between w-full",
		children: [
			...(label
				? [container({
						tw: "flex flex-row items-center",
						children: [
							container({ tw: "w-3 h-10 bg-[#E0479E] mr-8 flex-shrink-0", children: [] }),
							text({ text: label, tw: "text-[44px] text-[#686868] tracking-[0.01em]" }),
						],
					})]
				: [container({ tw: "flex", children: [] })]),
			text({ text: short, tw: "text-[28px] text-[#383838] tracking-[0.06em]" }),
		],
	});

	// Row 4 — footer
	const footer = container({
		tw: "flex flex-row items-center justify-between w-full",
		children: [
			text({ text: "sigilwallet.org/pay", tw: "text-[24px] text-[#2a2a2a] tracking-[0.12em]" }),
			text({ text: "QUBIC NETWORK", tw: "text-[22px] text-[#222222] tracking-[0.3em]" }),
		],
	});

	const root = container({
		tw: "flex flex-row w-full h-full bg-[#080808]",
		children: [
			container({ tw: "w-8 h-full bg-[#E0479E] flex-shrink-0", children: [] }),
			container({
				tw: "flex flex-col flex-1 h-full justify-between px-72 pt-48 pb-48",
				children: [
					header,
					HR("#E0479E"),  // hot rule under header
					amountRow,
					HR(),           // rule under amount
					metaRow,
					HR(),           // rule above footer
					footer,
				],
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
