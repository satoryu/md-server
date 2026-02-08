import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml, wrapWithHtmlTemplate } from '../src/markdown.js';

describe('markdown', () => {
  describe('convertMarkdownToHtml', () => {
    it('should convert heading to HTML', () => {
      const markdown = '# Hello World';
      const html = convertMarkdownToHtml(markdown);
      expect(html).toContain('<h1>Hello World</h1>');
    });

    it('should convert paragraph to HTML', () => {
      const markdown = 'This is a paragraph.';
      const html = convertMarkdownToHtml(markdown);
      expect(html).toContain('<p>This is a paragraph.</p>');
    });

    it('should convert bold text to HTML', () => {
      const markdown = '**bold text**';
      const html = convertMarkdownToHtml(markdown);
      expect(html).toContain('<strong>bold text</strong>');
    });

    it('should convert links to HTML', () => {
      const markdown = '[link](https://example.com)';
      const html = convertMarkdownToHtml(markdown);
      expect(html).toContain('<a href="https://example.com">link</a>');
    });

    it('should convert code blocks to HTML', () => {
      const markdown = '```js\nconsole.log("hello");\n```';
      const html = convertMarkdownToHtml(markdown);
      expect(html).toContain('<pre>');
      expect(html).toContain('console');
      expect(html).toContain('log');
    });

    describe('syntax highlighting', () => {
      it('should highlight code blocks with a known language', () => {
        const markdown = '```javascript\nconst x = 42;\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).toContain('hljs');
        expect(html).toContain('<span');
      });

      it('should highlight code blocks without a language using auto-detection', () => {
        const markdown = '```\nfunction hello() { return "world"; }\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).toContain('<pre>');
        expect(html).toContain('<code');
        expect(html).toContain('hello');
      });

      it('should handle code blocks with an unknown language gracefully', () => {
        const markdown = '```unknownlang123\nsome random code\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).toContain('<pre>');
        expect(html).toContain('some random code');
      });

      it('should add language class to code element for known languages', () => {
        const markdown = '```python\nprint("hello")\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).toContain('language-python');
      });
    });

    describe('mermaid rendering', () => {
      it('should output mermaid code block as <pre class="mermaid">', () => {
        const markdown = '```mermaid\ngraph TD\n  A --> B\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).toContain('<pre class="mermaid">');
        expect(html).toContain('graph TD');
        expect(html).toContain('A --> B');
      });

      it('should not apply highlight.js to mermaid code blocks', () => {
        const markdown = '```mermaid\ngraph TD\n  A --> B\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).not.toContain('hljs');
        expect(html).not.toContain('<code');
      });

      it('should still highlight normal code blocks when mermaid blocks exist', () => {
        const markdown = '```mermaid\ngraph TD\n  A --> B\n```\n\n```javascript\nconst x = 42;\n```';
        const html = convertMarkdownToHtml(markdown);
        expect(html).toContain('<pre class="mermaid">');
        expect(html).toContain('hljs');
      });
    });
  });

  describe('wrapWithHtmlTemplate', () => {
    it('should wrap content with HTML template', () => {
      const content = '<h1>Hello</h1>';
      const html = wrapWithHtmlTemplate(content, 'Test Title');

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<title>Test Title</title>');
      expect(html).toContain('<h1>Hello</h1>');
    });

    it('should include viewport meta tag', () => {
      const html = wrapWithHtmlTemplate('<p>Content</p>', 'Title');
      expect(html).toContain('viewport');
    });

    it('should include basic styles', () => {
      const html = wrapWithHtmlTemplate('<p>Content</p>', 'Title');
      expect(html).toContain('<style>');
    });

    it('should include highlight.js theme styles', () => {
      const html = wrapWithHtmlTemplate('<p>Content</p>', 'Title');
      expect(html).toContain('.hljs');
    });

    it('should include Mermaid.js CDN script', () => {
      const html = wrapWithHtmlTemplate('<p>Content</p>', 'Title');
      expect(html).toContain('mermaid');
      expect(html).toContain('<script');
      expect(html).toContain('cdn.jsdelivr.net/npm/mermaid');
    });
  });
});
