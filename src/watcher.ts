import chokidar from 'chokidar';
import { EventEmitter } from 'events';

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink';
  path: string;
  timestamp: number;
}

export interface FileWatcher extends EventEmitter {
  close(): Promise<void>;
}

export function createWatcher(dir: string): FileWatcher {
  const emitter = new EventEmitter() as FileWatcher;

  const watcher = chokidar.watch(dir, {
    persistent: true,
    ignoreInitial: true,
  });

  const isMarkdownFile = (path: string): boolean => path.endsWith('.md');

  const emitChange = (type: FileChangeEvent['type'], path: string) => {
    if (!isMarkdownFile(path)) return;
    const event: FileChangeEvent = {
      type,
      path,
      timestamp: Date.now(),
    };
    emitter.emit('change', event);
  };

  watcher.on('add', (path) => emitChange('add', path));
  watcher.on('change', (path) => emitChange('change', path));
  watcher.on('unlink', (path) => emitChange('unlink', path));
  watcher.on('ready', () => emitter.emit('ready'));

  emitter.close = async () => {
    await watcher.close();
  };

  return emitter;
}
