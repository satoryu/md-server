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
      expect(html).toContain('console.log');
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
  });
});
