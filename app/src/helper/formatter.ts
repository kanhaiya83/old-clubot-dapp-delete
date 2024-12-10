export function markdownToHtml(text: string) {
	let markdownText = text

	// Convert headers, adding a class for chat-style
	markdownText = markdownText
		.replace(/^### (.*$)/gim, '<h3 class="chat-header">$1</h3>')
		.replace(/^## (.*$)/gim, '<h2 class="chat-header">$2</h2>')
		.replace(/^# (.*$)/gim, '<h1 class="chat-header">$3</h1>')

	// Links with chat-style
	markdownText = markdownText.replace(
		/<a(?![^>]*\btarget=)([^>]*)>/g,
		'<a target="_blank" class="chat-link" style="color: #1212e1;"$1>',
	)

	// Bold and italic with specific classes for chat
	markdownText = markdownText
		.replace(/\*\*(.*?)\*\*/g, '<b class="chat-bold">$1</b>')
		.replace(/\*(.*?)\*/g, '<i class="chat-italic">$1</i>')

	// Inline code with chat-specific styling
	markdownText = markdownText.replace(
		/`([^`]+)`/g,
		'<code class="chat-code">$1</code>',
	)

	// Hyperlinks styled for chat
	markdownText = markdownText.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" class="chat-link">$1</a>',
	)

	// Unordered and ordered lists with chat styling
	markdownText = markdownText
		.replace(
			/^(?:\s*\*\s|\s*\-\s)(.*)/gm,
			'<ul class="chat-list"><li class="chat-list-item">$1</li></ul>',
		)
		.replace(/<\/ul>\s*<ul>/g, '') // Remove consecutive <ul> tags
		.replace(
			/^\d+\.\s(.+)/gm,
			'<ol class="chat-ordered-list"><li class="chat-list-item">$1</li></ol>',
		)
		.replace(/<\/ol>\s*<ol>/g, '') // Remove consecutive <ol> tags

	// Ensure proper formatting within lists
	markdownText = markdownText.replace(
		/<\/li><ul><li>(\s*<b>.*<\/b>.*)<\/li><\/ul>/g,
		'<br>$1',
	)

	// Wrap in a div with a chat-message class
	markdownText = `<div class="chat-message">${markdownText}</div>`

	return markdownText
}
