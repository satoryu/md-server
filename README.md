# MD Server : A Tiny Web Server for Markdown

## Overview

This package provides a tiny web server for publishing documents written in Markdown.

## Getting Started

```bash
npm install -g @satoryu/md-server
cd /path/to/your/markdown/documents/
mds
```

This will start a web server at `http://localhost:3000` that converts the Markdown documents in the current directory to HTML and serves them.

## Usage

```bash
mds --watch
```

### `--port <number>`

Specify the port number on which the server listens. The default is `3000`.

### `--watch`

Watch the Markdown files for changes and automatically reload the server when changes are detected.

### `--public <path_to_directory>`

Specify the directory in which `mds` publishes the Markdown documents.

## LICENSE

MIT LICENSE
