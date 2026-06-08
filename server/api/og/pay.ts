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

	// Render at 2× for crispness — og:image:width/height meta stays 1200×630
	const W = 2400;
	const H = 1260;

	// Left panel: identity + branding
	const leftPanel = container({
		tw: "flex flex-col justify-between h-full",
		children: [
			// Top block
			container({
				tw: "flex flex-col",
				children: [
					text({ text: "PAYMENT REQUEST", tw: "text-[26px] text-[#E0479E] tracking-[0.3em] font-bold mb-12" }),
					// Address row
					container({
						tw: "flex flex-row items-center mb-6",
						children: [
							container({ tw: "w-4 h-12 bg-[#E0479E] mr-8 flex-shrink-0", children: [] }),
							text({
								text: short ?? "INVALID LINK",
								tw: `text-[30px] tracking-[0.05em] ${short ? "text-[#4a4a4a]" : "text-[#2a2a2a]"}`,
							}),
						],
					}),
					...(label
						? [text({ text: `"${label}"`, tw: "text-[36px] text-[#666666] mt-4 tracking-[0.02em]" })]
						: []),
				],
			}),
			// Bottom branding
			container({
				tw: "flex flex-row items-center",
				children: [
					text({ text: "[", tw: "text-[40px] font-bold text-[#E0479E] mr-2 tracking-tight" }),
					container({ tw: "w-3 h-3 bg-[#E0479E] mx-2", children: [] }),
					text({ text: "]", tw: "text-[40px] font-bold text-[#E0479E] ml-2 mr-8 tracking-tight" }),
					text({ text: "SIGIL", tw: "text-[28px] font-bold text-[#303030] tracking-[0.3em]" }),
				],
			}),
		],
	});

	// Right panel: amount (or placeholder)
	const rightPanel = container({
		tw: "flex flex-col items-end justify-center h-full",
		children: amtLabel
			? [
					text({ text: amtLabel.replace(" QU", ""), tw: "text-[160px] font-bold text-[#4ade80] leading-none tracking-[-0.04em] text-right" }),
					text({ text: "QU", tw: "text-[72px] font-bold text-[#2a5e3a] tracking-[0.1em] text-right mt-4" }),
				]
			: [
					text({ text: "OPEN IN", tw: "text-[36px] text-[#2a2a2a] tracking-[0.2em] text-right" }),
					text({ text: "SIGIL", tw: "text-[96px] font-bold text-[#2a2a2a] tracking-[0.05em] text-right" }),
				],
	});

	const root = container({
		tw: "flex flex-row w-full h-full bg-[#080808]",
		children: [
			// Left magenta accent bar
			container({ tw: "w-6 h-full bg-[#E0479E] flex-shrink-0", children: [] }),
			// Left content panel
			container({
				tw: "flex flex-col flex-1 px-36 py-28",
				children: [leftPanel],
			}),
			// Vertical divider
			container({ tw: "w-px h-full bg-[#181818] flex-shrink-0", children: [] }),
			// Right amount panel
			container({
				tw: "flex flex-col px-36 py-28",
				style: { width: 880 },
				children: [rightPanel],
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
