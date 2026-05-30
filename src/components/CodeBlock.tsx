interface CodeBlockProps {
	html: string;
	label?: string;
}

export function CodeBlock({ html, label }: CodeBlockProps) {
	return (
		<div className="doc-pre">
			{label && <span className="pre-label">{label}</span>}
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output — server-generated, not user input */}
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	);
}
