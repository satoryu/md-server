# 008: Mermaid Diagram Rendering - Design

## Architecture Overview

Mermaidダイアグラムのレンダリングはクライアントサイドで行う。サーバー側ではMermaidコードブロックを特別なHTML要素として出力し、ブラウザ上でMermaid.jsライブラリがそれをSVGに変換する。

```mermaid
flowchart LR
    A[Markdown Source] --> B[marked.parse]
    B -->|mermaid code block| C[Mermaid HTML Element]
    B -->|other code block| D[highlight.js]
    C --> E[wrapWithHtmlTemplate]
    D --> E
    E -->|includes Mermaid.js CDN| F[Complete HTML Page]
    F -->|browser| G[Mermaid.js renders SVG]
```

## Component Design

### markdown.ts の変更

#### カスタムレンダラーの拡張

既存の `renderer.code` 関数に、`lang === 'mermaid'` の場合の分岐を追加する。

```mermaid
flowchart TD
    A[renderer.code called] --> B{lang === 'mermaid'?}
    B -->|Yes| C["Output <pre class='mermaid'>"]
    B -->|No| D{lang is known?}
    D -->|Yes| E[highlight.js highlight]
    D -->|No| F{lang is empty?}
    F -->|Yes| G[hljs.highlightAuto]
    F -->|No| H[escaped plain text]
```

Mermaidコードブロックの場合、以下のHTML要素を出力する:

```html
<pre class="mermaid">{mermaid code}</pre>
```

Mermaid.jsは `class="mermaid"` を持つ `<pre>` 要素を自動的に検出し、SVGに変換する。

#### HTMLテンプレートの拡張

`wrapWithHtmlTemplate` 関数に以下を追加する:

1. Mermaid.js CDNスクリプトの読み込み（`<script>` タグ）
2. Mermaidの初期化は不要（Mermaid.js v10+はauto-initをサポート）

## Data Flow

```mermaid
sequenceDiagram
    participant User as Browser
    participant Server as md-server
    participant CDN as CDN (esm.sh)

    User->>Server: GET /document.md
    Server->>Server: Read .md file
    Server->>Server: marked.parse() with custom renderer
    Note over Server: mermaid blocks → <pre class="mermaid">
    Note over Server: other blocks → highlight.js
    Server->>Server: wrapWithHtmlTemplate()
    Note over Server: Include Mermaid.js CDN script
    Server-->>User: HTML Response
    User->>CDN: Load mermaid.js
    CDN-->>User: mermaid.js library
    User->>User: Mermaid.js auto-init
    Note over User: <pre class="mermaid"> → SVG
```

## Domain Models

変更対象は `markdown.ts` の2つの関数のみ:

| 関数 | 変更内容 |
|------|----------|
| `renderer.code` | `lang === 'mermaid'` の場合に `<pre class="mermaid">` を出力する分岐を追加 |
| `wrapWithHtmlTemplate` | Mermaid.js CDNスクリプトを `<body>` の末尾に追加 |
