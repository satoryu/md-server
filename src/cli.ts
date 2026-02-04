#!/usr/bin/env node

import { Command } from 'commander';
import { createServer, startServer } from './server.js';

const program = new Command();

program
  .name('mds')
  .description('A tiny web server for publishing Markdown documents')
  .version('0.0.1')
  .option('-p, --port <number>', 'port number to listen on', '3000')
  .option('-w, --watch', 'watch for file changes and auto-reload')
  .action(async (options) => {
    const port = parseInt(options.port, 10);
    const publicDir = process.cwd();
    const watch = options.watch ?? false;

    const serverInstance = createServer({ publicDir, watch });

    if (watch) {
      console.log('Watch mode enabled. Files will be monitored for changes.');
    }

    await startServer(serverInstance.app, port);
  });

program.parse();
