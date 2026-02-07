# Implementation Tasks: Subdirectory Markdown Serving

## Task Checklist

### Phase 1: Path Validator

- [x] **Task 1.1**: Create path validator tests (`tests/path-validator.test.ts`)
  - [x] Test: 正常なパスがバリデーションを通過する
  - [x] Test: `..` を含むパスが拒否される
  - [x] Test: URLエンコードされた `..` も拒否される
  - [x] Test: publicDir外へのアクセスが拒否される
  - [x] Test: 存在しないファイルでエラーを返す

- [x] **Task 1.2**: Implement path validator (`src/path-validator.ts`)
  - [x] `validateAndResolvePath()` 関数を実装
  - [x] パストラバーサル検出ロジックを実装
  - [x] すべてのテストがパスすることを確認

### Phase 2: File Scanner

- [x] **Task 2.1**: Create file scanner tests (`tests/file-scanner.test.ts`)
  - [x] Test: ルートディレクトリのmdファイルを取得できる
  - [x] Test: サブディレクトリのmdファイルを取得できる
  - [x] Test: ネストされたディレクトリのファイルを取得できる
  - [x] Test: md以外のファイルは含まれない
  - [x] Test: 空のディレクトリでは空配列を返す

- [x] **Task 2.2**: Implement file scanner (`src/file-scanner.ts`)
  - [x] `scanMarkdownFiles()` 関数を実装
  - [x] 再帰的なディレクトリ探索を実装
  - [x] すべてのテストがパスすることを確認

### Phase 3: Server Route Changes

- [x] **Task 3.1**: Add server tests for subdirectory serving
  - [x] Test: サブディレクトリのmdファイルにアクセスできる
  - [x] Test: ネストされたパスでアクセスできる
  - [x] Test: パストラバーサル攻撃が適切に処理される
  - [x] Test: 存在しないサブディレクトリのファイルが404を返す

- [x] **Task 3.2**: Add server tests for file listing
  - [x] Test: ファイル一覧にサブディレクトリのファイルが含まれる

- [x] **Task 3.3**: Update server routes (`src/server.ts`)
  - [x] Markdownファイル配信ルートをワイルドカードに変更
  - [x] path-validatorを使用してパスを検証
  - [x] すべてのテストがパスすることを確認

- [x] **Task 3.4**: Update file listing (`src/server.ts`)
  - [x] file-scannerを使用してファイル一覧を取得
  - [x] サブディレクトリのファイルも表示
  - [x] すべてのテストがパスすることを確認

### Phase 4: Watch Mode

- [x] **Task 4.1**: Verify watcher supports subdirectories
  - [x] 現在のwatcher実装を確認（chokidarはデフォルトで再帰監視）
  - [x] サブディレクトリの変更が検知されることを確認
  - [x] 変更不要

### Phase 5: Integration & Cleanup

- [x] **Task 5.1**: Run all tests and ensure they pass
  - [x] `npm run test` ですべてのテストがパス（64件）

- [ ] **Task 5.2**: Manual testing
  - [ ] 実際にサーバーを起動してサブディレクトリのファイルにアクセス
  - [ ] ファイル一覧の表示を確認
  - [ ] Watchモードでサブディレクトリのファイル変更を確認

- [x] **Task 5.3**: Code cleanup
  - [x] 不要なコメントを削除
  - [x] コードフォーマットを確認

## Notes

- 各タスクはTDD（テスト駆動開発）で実装する
- テストを先に書き、失敗することを確認してから実装する
- 1つのタスクが完了したら、チェックを入れてコミットする
