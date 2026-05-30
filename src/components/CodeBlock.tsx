import { useState } from "react";

interface CodeBlockProps {
	html: string;
	label?: string;
}

export function CodeBlock({ html, label }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const copy = () => {
		const tmp = document.createElement("div");
		tmp.innerHTML = html;
		const lines = Array.from(tmp.querySelectorAll(".line"));
		const text = lines
			.map((l) => l.textContent ?? "")
			.join("\n")
			.trimEnd();
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		});
	};

	return (
		<div className="doc-pre">
			<div className="pre-header">
				{label && <span className="pre-label">{label}</span>}
				<button
					className={`pre-copy${copied ? " copied" : ""}`}
					onClick={copy}
					type="button"
					aria-label="Copy code"
				>
					{copied ? "COPIED" : "COPY"}
				</button>
			</div>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output — server-generated, not user input */}
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	);
}
