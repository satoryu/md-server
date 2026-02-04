# Requirements: 001-minimal-server

## Problem Statement

ユーザーがMarkdownで書かれたドキュメントを簡単にWebブラウザで閲覧できるようにしたい。現状ではMarkdownファイルをHTMLに手動で変換するか、専用のツールをインストールする必要があり、手軽さに欠ける。

## Requirements

### Functional Requirements

1. **FR-1**: `mds` コマンドを実行すると、Webサーバーが起動する
2. **FR-2**: サーバーはデフォルトでポート3000で起動する
3. **FR-3**: `--port <number>` オプションでポート番号を変更できる
4. **FR-4**: ルートURL (`/`) にアクセスすると、カレントディレクトリ内の `.md` ファイル一覧が表示される
5. **FR-5**: ファイル名をクリックすると、MarkdownがHTMLに変換されて表示される

### Non-Functional Requirements

1. **NFR-1**: サーバー起動は1秒以内に完了する
2. **NFR-2**: Markdownの変換は即座に行われる（キャッシュなし）

## Constraints

- Node.js 18以上が必要
- 今回のスコープでは `--watch` と `--public` オプションは実装しない
- 外部CSSフレームワークは使用しない（シンプルなスタイルのみ）

## Acceptance Criteria

1. `npm run dev` でサーバーが起動し、`http://localhost:3000` でアクセスできる
2. `npm run dev -- --port 4000` でポート4000でサーバーが起動する
3. ブラウザでルートURLにアクセスすると、Markdownファイルの一覧が表示される
4. 一覧からファイルを選択すると、HTMLに変換された内容が表示される
5. 全てのテストがパスする

## User Stories

### US-1: ドキュメントの閲覧

**As a** ドキュメント作成者
**I want to** MarkdownファイルをWebブラウザで閲覧したい
**So that** フォーマットされた状態で内容を確認できる

### US-2: ポート番号の変更

**As a** 開発者
**I want to** サーバーのポート番号を変更したい
**So that** 他のアプリケーションとポートが競合しないようにできる
