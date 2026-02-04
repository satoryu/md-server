# Tasks: 001-minimal-server

## Implementation Checklist

### Phase 1: Markdown変換モジュール

- [x] `tests/markdown.test.ts` を作成
  - [x] `convertMarkdownToHtml()` のテストを書く
  - [x] `wrapWithHtmlTemplate()` のテストを書く
- [x] `src/markdown.ts` を実装
  - [x] `convertMarkdownToHtml()` を実装
  - [x] `wrapWithHtmlTemplate()` を実装
- [x] テストがパスすることを確認

### Phase 2: サーバーモジュール

- [x] `tests/server.test.ts` を作成
  - [x] GET `/` のテストを書く（ファイル一覧）
  - [x] GET `/:filename.md` のテストを書く（Markdown表示）
  - [x] 404エラーのテストを書く
- [x] `src/server.ts` を実装
  - [x] `createServer()` を実装
  - [x] ルート `/` ハンドラを実装
  - [x] `/:filename.md` ハンドラを実装
- [x] テストがパスすることを確認

### Phase 3: CLIモジュール

- [x] `src/cli.ts` を実装
  - [x] commanderでオプション解析を実装
  - [x] サーバー起動処理を実装

### Phase 4: 統合テスト

- [x] `npm run dev` でサーバーが起動することを確認
- [x] ブラウザでファイル一覧が表示されることを確認
- [x] Markdownファイルが正しくHTMLに変換されることを確認
- [x] `--port` オプションが機能することを確認

### Phase 5: クリーンアップ

- [x] 不要なファイル（.gitkeepなど）を削除
- [ ] コードレビューを実施
- [ ] コミット・プッシュ
