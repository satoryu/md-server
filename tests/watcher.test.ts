import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createWatcher, type FileWatcher } from '../src/watcher.js';
import { mkdirSync, writeFileSync, rmSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

function waitForReady(watcher: FileWatcher): Promise<void> {
  return new Promise((resolve) => {
    watcher.on('ready', () => {
      // Small delay to ensure watcher is fully initialized
      setTimeout(resolve, 100);
    });
  });
}

describe('watcher', () => {
  const testDir = join(tmpdir(), 'md-server-watcher-test-' + Date.now());
  let watcher: FileWatcher | null = null;

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(async () => {
    if (watcher) {
      await watcher.close();
      watcher = null;
    }
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('createWatcher', () => {
    it('should create a watcher for the specified directory', async () => {
      watcher = createWatcher(testDir);
      expect(watcher).toBeDefined();
      expect(typeof watcher.close).toBe('function');
    });

    it('should emit "change" event when a markdown file is modified', async () => {
      const testFile = join(testDir, 'test.md');
      writeFileSync(testFile, '# Initial content');

      watcher = createWatcher(testDir);
      await waitForReady(watcher);

      const changePromise = new Promise<{ type: string; path: string }>((resolve) => {
        watcher!.on('change', (event) => {
          resolve(event);
        });
      });

      // Modify the file
      writeFileSync(testFile, '# Modified content');

      const event = await changePromise;
      expect(event.type).toBe('change');
      expect(event.path).toContain('test.md');
    }, 10000);

    it('should emit "change" event with type "add" when a new markdown file is added', async () => {
      watcher = createWatcher(testDir);
      await waitForReady(watcher);

      const changePromise = new Promise<{ type: string; path: string }>((resolve) => {
        watcher!.on('change', (event) => {
          resolve(event);
        });
      });

      // Add a new file
      const newFile = join(testDir, 'new.md');
      writeFileSync(newFile, '# New file');

      const event = await changePromise;
      expect(event.type).toBe('add');
      expect(event.path).toContain('new.md');
    }, 10000);

    it('should emit "change" event with type "unlink" when a markdown file is deleted', async () => {
      const testFile = join(testDir, 'delete-me.md');
      writeFileSync(testFile, '# To be deleted');

      watcher = createWatcher(testDir);
      await waitForReady(watcher);

      const changePromise = new Promise<{ type: string; path: string }>((resolve) => {
        watcher!.on('change', (event) => {
          if (event.type === 'unlink') {
            resolve(event);
          }
        });
      });

      // Delete the file
      unlinkSync(testFile);

      const event = await changePromise;
      expect(event.type).toBe('unlink');
      expect(event.path).toContain('delete-me.md');
    }, 10000);

    it('should only watch markdown files (.md)', async () => {
      watcher = createWatcher(testDir);
      await waitForReady(watcher);

      let nonMdEventReceived = false;
      watcher.on('change', (event) => {
        if (event.path.endsWith('.txt')) {
          nonMdEventReceived = true;
        }
      });

      // Create a non-markdown file
      writeFileSync(join(testDir, 'test.txt'), 'text content');

      // Wait a bit to see if event fires
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(nonMdEventReceived).toBe(false);
    });

    it('should close watcher properly', async () => {
      watcher = createWatcher(testDir);
      await waitForReady(watcher);
      await watcher.close();

      // After close, watcher should not emit events
      let eventReceived = false;
      watcher.on('change', () => {
        eventReceived = true;
      });

      writeFileSync(join(testDir, 'after-close.md'), '# After close');
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(eventReceived).toBe(false);
      watcher = null; // Prevent double close in afterEach
    });
  });
});
