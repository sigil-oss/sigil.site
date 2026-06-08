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
	const label = typeof q.label === "string" ? q.label.slice(0, 60) : "";

	const isValid = to.length === 60 && /^[A-Z]+$/.test(to);
	const short = isValid ? `${to.slice(0, 12)}…${to.slice(-10)}` : null;
	const amtNum = amount ? parseInt(amount, 10) : Number.NaN;
	const amtLabel = Number.isFinite(amtNum) && amtNum > 0 ? `${amtNum.toLocaleString("en")} QU` : null;

	const fonts = await getFonts();

	// Render at 2× for crispness; og:image:width/height stay 1200×630
	const W = 2400;
	const H = 1260;

	const topSection = container({
		tw: "flex flex-col",
		children: [
			text({ text: "PAYMENT REQUEST", tw: "text-[28px] text-[#E0479E] tracking-[0.35em] font-bold mb-6" }),
			text({
				text: "SIGIL",
				tw: "text-[96px] font-bold text-white tracking-[-0.02em] leading-none mb-8",
			}),
			container({
				tw: "flex items-center",
				children: [
					container({
						tw: "w-2 h-10 bg-[#E0479E] mr-6 flex-shrink-0",
						children: [],
					}),
					text({
						text: short ?? "INVALID LINK",
						tw: `text-[28px] tracking-[0.06em] ${short ? "text-[#484848]" : "text-[#2a2a2a]"}`,
					}),
				],
			}),
		],
	});

	const amountSection = amtLabel
		? container({
				tw: "flex flex-col mt-10",
				children: [
					text({ text: amtLabel, tw: "text-[120px] font-bold text-[#4ade80] leading-none tracking-[-0.03em]" }),
					...(label
						? [text({ text: label, tw: "text-[36px] text-[#606060] mt-4 tracking-[0.02em]" })]
						: []),
				],
			})
		: label
			? text({ text: `"${label}"`, tw: "text-[48px] text-[#606060] mt-10 tracking-[0.02em]" })
			: container({ tw: "flex mt-10", children: [] });

	const bottomBar = container({
		tw: "flex justify-between items-center w-full mt-auto pt-8 border-t border-[#1c1c1c]",
		children: [
			container({
				tw: "flex items-center",
				children: [
					text({ text: "[ ]", tw: "text-[28px] font-bold text-[#E0479E] mr-4 tracking-[-0.05em]" }),
					text({ text: "SIGIL WALLET", tw: "text-[22px] font-bold text-[#2a2a2a] tracking-[0.25em]" }),
				],
			}),
			text({ text: "sigilwallet.org/pay", tw: "text-[22px] text-[#2a2a2a] tracking-[0.12em]" }),
		],
	});

	const root = container({
		tw: "flex flex-row w-full h-full bg-[#080808]",
		children: [
			// Left magenta accent bar
			container({ tw: "w-6 h-full bg-[#E0479E] flex-shrink-0", children: [] }),
			// Main content
			container({
				tw: "flex flex-col flex-1 px-40 py-32",
				children: [topSection, amountSection, bottomBar],
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
