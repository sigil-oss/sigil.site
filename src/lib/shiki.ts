import {
	createHighlighter,
	type BundledLanguage,
	type Highlighter,
} from "shiki";

const THEME = "github-dark-dimmed" as const;
const LANGS: BundledLanguage[] = [
	"typescript",
	"javascript",
	"json",
	"bash",
	"html",
	"text",
];

let _h: Highlighter | null = null;

async function getHighlighter() {
	if (!_h) {
		_h = await createHighlighter({ themes: [THEME], langs: LANGS });
	}
	return _h;
}

export async function hl(
	code: string,
	lang: BundledLanguage | "text",
): Promise<string> {
	const h = await getHighlighter();
	return h.codeToHtml(code.trim(), {
		lang: lang === "text" ? "text" : lang,
		theme: THEME,
		transformers: [
			{
				pre(node) {
					// Strip background — our .doc-pre CSS handles it
					if (typeof node.properties?.style === "string") {
						node.properties.style = node.properties.style
							.replace(/background-color:[^;]+;?\s*/g, "")
							.replace(/color:[^;]+;?\s*/g, "");
					}
				},
			},
		],
	});
}
