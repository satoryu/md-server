import express, { type Express, type Response } from 'express';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { convertMarkdownToHtml, wrapWithHtmlTemplate } from './markdown.js';
import { createWatcher, type FileWatcher } from './watcher.js';
import { getReloadScript } from './reload-script.js';

export interface ServerOptions {
  publicDir: string;
  watch?: boolean;
}

export interface ServerInstance {
  app: Express;
  close(): Promise<void>;
}

type SSEClient = Response;

export function createServer(options: ServerOptions): ServerInstance {
  const app = express();
  const { publicDir, watch = false } = options;

  let watcher: FileWatcher | null = null;
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  const sseClients: Set<SSEClient> = new Set();

  const injectReloadScript = (html: string): string => {
    if (!watch) return html;
    return html.replace('</body>', `${getReloadScript()}</body>`);
  };

  if (watch) {
    watcher = createWatcher(publicDir);
    watcher.on('change', () => {
      for (const client of sseClients) {
        client.write('event: reload\ndata: {}\n\n');
      }
    });

    // Send heartbeat every 30 seconds to keep connections alive
    heartbeatInterval = setInterval(() => {
      for (const client of sseClients) {
        client.write(': heartbeat\n\n');
      }
    }, 30000);

    // SSE endpoint
    app.get('/events', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
    });
  }

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

    const html = injectReloadScript(wrapWithHtmlTemplate(content, 'Markdown Files'));
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
    const html = injectReloadScript(wrapWithHtmlTemplate(htmlContent, filename));

    res.type('html').send(html);
  });

  return {
    app,
    async close() {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      if (watcher) {
        await watcher.close();
      }
      for (const client of sseClients) {
        client.end();
      }
      sseClients.clear();
    },
  };
}

export function startServer(app: Express, port: number): Promise<void> {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      resolve();
    });
  });
}
