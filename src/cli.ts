#!/usr/bin/env node

import { Command } from 'commander';
import { createServer, startServer } from './server.js';

const program = new Command();

program
  .name('mds')
  .description('A tiny web server for publishing Markdown documents')
  .version('0.0.1')
  .option('-p, --port <number>', 'port number to listen on', '3000')
  .action(async (options) => {
    const port = parseInt(options.port, 10);
    const publicDir = process.cwd();

    const app = createServer({ publicDir });
    await startServer(app, port);
  });

program.parse();
