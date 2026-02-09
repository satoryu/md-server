import express, { type Express, type Response } from 'express';
import { readFileSync } from 'node:fs';
import { convertMarkdownToHtml, wrapWithHtmlTemplate, escapeHtml } from './markdown.js';
import { createWatcher, type FileWatcher } from './watcher.js';
import { getReloadScript } from './reload-script.js';
import { validateAndResolvePath } from './path-validator.js';
import { scanMarkdownFiles } from './file-scanner.js';
import { createIgnoreFilter } from './ignore-filter.js';
import { requestLogger } from './logger.js';

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

  app.use(requestLogger());

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

  // GET / - List markdown files (including subdirectories)
  app.get('/', (_req, res) => {
    const isIgnored = createIgnoreFilter(publicDir);
    const files = scanMarkdownFiles(publicDir, isIgnored);

    const fileList = files
      .map((file) => {
        const escaped = escapeHtml(file.relativePath);
        return `<li><a href="/${encodeURI(file.relativePath)}">${escaped}</a></li>`;
      })
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

  // GET /*.md - Serve markdown file as HTML (supports subdirectories)
  app.get('/*.md', (req, res) => {
    const requestPath = req.path.slice(1);
    const validation = validateAndResolvePath(requestPath, publicDir);

    if (!validation.valid) {
      if (validation.errorType === 'not_found') {
        res.status(404).send('File not found');
      } else {
        res.status(400).send(validation.error || 'Invalid path');
      }
      return;
    }

    const isIgnored = createIgnoreFilter(publicDir);
    if (isIgnored(requestPath)) {
      res.status(404).send('File not found');
      return;
    }

    const markdown = readFileSync(validation.resolvedPath!, 'utf-8');
    const htmlContent = convertMarkdownToHtml(markdown);
    const html = injectReloadScript(wrapWithHtmlTemplate(htmlContent, requestPath));

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
