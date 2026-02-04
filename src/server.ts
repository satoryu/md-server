import express, { type Express } from 'express';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { convertMarkdownToHtml, wrapWithHtmlTemplate } from './markdown.js';

export interface ServerOptions {
  publicDir: string;
}

export function createServer(options: ServerOptions): Express {
  const app = express();
  const { publicDir } = options;

  // GET / - List markdown files
  app.get('/', (_req, res) => {
    const files = readdirSync(publicDir).filter((file) => file.endsWith('.md'));

    const fileList = files
      .map((file) => `<li><a href="/${file}">${file}</a></li>`)
      .join('\n');

    const content = `
      <h1>Markdown Files</h1>
      <ul>
        ${fileList}
      </ul>
    `;

    const html = wrapWithHtmlTemplate(content, 'Markdown Files');
    res.type('html').send(html);
  });

  // GET /:filename.md - Serve markdown file as HTML
  app.get('/:filename.md', (req, res) => {
    const filename = req.params.filename + '.md';
    const filepath = join(publicDir, filename);

    if (!existsSync(filepath)) {
      res.status(404).send('File not found');
      return;
    }

    const markdown = readFileSync(filepath, 'utf-8');
    const htmlContent = convertMarkdownToHtml(markdown);
    const html = wrapWithHtmlTemplate(htmlContent, filename);

    res.type('html').send(html);
  });

  return app;
}

export function startServer(app: Express, port: number): Promise<void> {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      resolve();
    });
  });
}
