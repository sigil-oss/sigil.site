import { defineEventHandler, getQuery } from "h3";
import { render } from "takumi-js";
import { googleFont, container, text, type ContainerNode, type TextNode } from "@takumi-rs/helpers";

type Node = ContainerNode | TextNode;
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
	const label = typeof q.label === "string" ? q.label.slice(0, 72) : "";

	const isValid = to.length === 60 && /^[A-Z]+$/.test(to);
	const short = isValid ? `${to.slice(0, 10)}…${to.slice(-8)}` : null;
	const amtNum = amount ? parseInt(amount, 10) : Number.NaN;
	const amtLabel = Number.isFinite(amtNum) && amtNum > 0 ? `${amtNum.toLocaleString("en")} QU` : null;

	const fonts = await getFonts();

	const children: Node[] = [
		text({ text: "[ SIGIL WALLET ]", tw: "text-[13px] text-[#333333] tracking-[0.28em] uppercase mb-10" }),
		text({ text: "PAYMENT REQUEST", tw: "text-5xl font-bold text-white tracking-[0.04em] mb-6" }),
		short
			? text({ text: short, tw: "text-xl text-[#505050] tracking-[0.06em] mb-10" })
			: text({ text: "INVALID LINK", tw: "text-xl text-[#3a3a3a] tracking-[0.06em]" }),
		...(amtLabel
			? [text({ text: amtLabel, tw: "text-6xl font-bold text-[#4ade80] tracking-[-0.01em] mb-4" })]
			: []),
		...(label
			? [container({
					tw: "flex items-center",
					children: [
						text({ text: "//", tw: "text-[15px] text-[#444444] mr-3" }),
						text({ text: label, tw: "text-2xl text-[#888888]" }),
					],
				})]
			: []),
		container({
			tw: "flex justify-between items-end w-full mt-auto",
			children: [
				text({ text: "sigilwallet.org", tw: "text-xs text-[#252525] tracking-[0.18em]" }),
				text({ text: "QUBIC", tw: "text-xs text-[#252525] tracking-[0.18em]" }),
			],
		}),
	];

	const png = await render(
		container({ tw: "flex flex-col w-full h-full bg-[#080808] px-20 py-16 text-[#e8e8e8]", children }),
		{ width: 1200, height: 630, fonts },
	);

	return new Response(png.buffer as ArrayBuffer, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
});
