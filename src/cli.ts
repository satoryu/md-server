#!/usr/bin/env node

import { Command } from 'commander';
import { createServer, startServer } from './server.js';
import { validatePublicDir } from './public-dir.js';

const program = new Command();

program
  .name('mds')
  .description('A tiny web server for publishing Markdown documents')
  .version('0.0.1')
  .option('-p, --port <number>', 'port number to listen on', '3000')
  .option('-P, --public <path>', 'directory to serve markdown files from')
  .option('-w, --watch', 'watch for file changes and auto-reload')
  .action(async (options) => {
    const port = parseInt(options.port, 10);
    const watch = options.watch ?? false;

    // Validate and resolve public directory
    let publicDir: string;
    try {
      publicDir = validatePublicDir(options.public ?? process.cwd());
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('Error: Failed to validate public directory.');
      }
      process.exit(1);
    }

    const serverInstance = createServer({ publicDir, watch });

    if (watch) {
      console.log('Watch mode enabled. Files will be monitored for changes.');
    }

    const shutdown = async () => {
      console.log('\nShutting down...');
      await serverInstance.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    await startServer(serverInstance.app, port);
  });

program.parse();
