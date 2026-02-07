import { marked } from 'marked';

/**
 * Convert Markdown text to HTML
 */
export function convertMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string;
}

/**
 * Wrap HTML content with a complete HTML template
 */
export function wrapWithHtmlTemplate(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    pre {
      background-color: #f4f4f4;
      padding: 16px;
      overflow-x: auto;
      border-radius: 4px;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
    pre code {
      padding: 0;
      background: none;
    }
    a {
      color: #0066cc;
    }
    img {
      max-width: 100%;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
