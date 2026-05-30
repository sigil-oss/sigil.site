import {
	type BundledLanguage,
	createHighlighter,
	type Highlighter,
} from "shiki";

const LANGS: BundledLanguage[] = [
	"typescript",
	"tsx",
	"javascript",
	"json",
	"bash",
	"html",
];

let _h: Highlighter | null = null;

async function getHighlighter() {
	if (!_h) {
		_h = await createHighlighter({
			themes: ["github-light", "github-dark-dimmed"],
			langs: LANGS,
		});
	}
	return _h;
}

export async function hl(
	code: string,
	lang: BundledLanguage | "text",
): Promise<string> {
	const h = await getHighlighter();
	return h.codeToHtml(code.trim(), {
		lang: (lang === "text" ? "plaintext" : lang) as BundledLanguage,
		themes: {
			light: "github-light",
			dark: "github-dark-dimmed",
		},
		defaultColor: false,
	});
}
