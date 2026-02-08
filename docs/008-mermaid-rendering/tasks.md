# 008: Mermaid Diagram Rendering - Tasks

## Implementation Tasks

- [x] 1. `renderer.code` にMermaidコードブロックの分岐を追加する
  - `lang === 'mermaid'` の場合、`<pre class="mermaid">{code}</pre>` を出力する
  - 既存のhighlight.js処理より前に判定する
- [x] 2. `wrapWithHtmlTemplate` にMermaid.js CDNスクリプトを追加する
  - `<body>` の末尾にMermaid.jsのESMモジュールとして `<script type="module">` タグを追加する
  - CDN: `https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs`
- [x] 3. テストを追加する
  - Mermaidコードブロックが `<pre class="mermaid">` として出力されることを確認
  - Mermaidコードブロックがhighlight.jsでハイライトされないことを確認
  - 通常のコードブロックが従来通りハイライトされることを確認
  - HTMLテンプレートにMermaid.jsのスクリプトタグが含まれることを確認
- [x] 4. 全てのテストがパスすることを確認する
