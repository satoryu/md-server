import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';

const renderer = new Renderer();
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  if (lang === 'mermaid') {
    return `<pre class="mermaid">${text}</pre>\n`;
  }
  if (lang && hljs.getLanguage(lang)) {
    const highlighted = hljs.highlight(text, { language: lang }).value;
    return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>\n`;
  }
  if (!lang) {
    const highlighted = hljs.highlightAuto(text).value;
    return `<pre><code class="hljs">${highlighted}</code></pre>\n`;
  }
  // Unknown language: fall back to escaped plain text
  return `<pre><code class="language-${lang}">${escapeHtml(text)}</code></pre>\n`;
};

/**
 * Convert Markdown text to HTML
 */
export function convertMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown, { renderer }) as string;
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
    /* highlight.js GitHub theme */
    pre code.hljs{display:block;overflow-x:auto;padding:0}
    code.hljs{padding:3px 5px}
    .hljs{color:#24292e;background:#f6f8fa}
    .hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#d73a49}
    .hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#6f42c1}
    .hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-variable,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id{color:#005cc5}
    .hljs-regexp,.hljs-string,.hljs-meta .hljs-string{color:#032f62}
    .hljs-built_in,.hljs-symbol{color:#e36209}
    .hljs-comment,.hljs-code,.hljs-formula{color:#6a737d}
    .hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo{color:#22863a}
    .hljs-subst{color:#24292e}
    .hljs-section{color:#005cc5;font-weight:bold}
    .hljs-bullet{color:#735c0f}
    .hljs-emphasis{color:#24292e;font-style:italic}
    .hljs-strong{color:#24292e;font-weight:bold}
    .hljs-addition{color:#22863a;background-color:#f0fff4}
    .hljs-deletion{color:#b31d28;background-color:#ffeef0}
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      overflow-x: auto;
      border-radius: 4px;
    }
    code {
      background-color: #f6f8fa;
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
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true });
  </script>
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
