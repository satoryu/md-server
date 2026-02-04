# Implementation Tasks: Subdirectory Markdown Serving

## Task Checklist

### Phase 1: Path Validator

- [ ] **Task 1.1**: Create path validator tests (`tests/path-validator.test.ts`)
  - [ ] Test: 正常なパスがバリデーションを通過する
  - [ ] Test: `..` を含むパスが拒否される
  - [ ] Test: URLエンコードされた `..` も拒否される
  - [ ] Test: publicDir外へのアクセスが拒否される
  - [ ] Test: 存在しないファイルでエラーを返す

- [ ] **Task 1.2**: Implement path validator (`src/path-validator.ts`)
  - [ ] `validateAndResolvePath()` 関数を実装
  - [ ] パストラバーサル検出ロジックを実装
  - [ ] すべてのテストがパスすることを確認

### Phase 2: File Scanner

- [ ] **Task 2.1**: Create file scanner tests (`tests/file-scanner.test.ts`)
  - [ ] Test: ルートディレクトリのmdファイルを取得できる
  - [ ] Test: サブディレクトリのmdファイルを取得できる
  - [ ] Test: ネストされたディレクトリのファイルを取得できる
  - [ ] Test: md以外のファイルは含まれない
  - [ ] Test: 空のディレクトリでは空配列を返す

- [ ] **Task 2.2**: Implement file scanner (`src/file-scanner.ts`)
  - [ ] `scanMarkdownFiles()` 関数を実装
  - [ ] 再帰的なディレクトリ探索を実装
  - [ ] すべてのテストがパスすることを確認

### Phase 3: Server Route Changes

- [ ] **Task 3.1**: Add server tests for subdirectory serving
  - [ ] Test: サブディレクトリのmdファイルにアクセスできる
  - [ ] Test: ネストされたパスでアクセスできる
  - [ ] Test: パストラバーサル攻撃が400を返す
  - [ ] Test: 存在しないサブディレクトリのファイルが404を返す

- [ ] **Task 3.2**: Add server tests for file listing
  - [ ] Test: ファイル一覧にサブディレクトリのファイルが含まれる
  - [ ] Test: ディレクトリ構造がわかる形式で表示される

- [ ] **Task 3.3**: Update server routes (`src/server.ts`)
  - [ ] Markdownファイル配信ルートをワイルドカードに変更
  - [ ] path-validatorを使用してパスを検証
  - [ ] すべてのテストがパスすることを確認

- [ ] **Task 3.4**: Update file listing (`src/server.ts`)
  - [ ] file-scannerを使用してファイル一覧を取得
  - [ ] サブディレクトリのファイルも表示
  - [ ] すべてのテストがパスすることを確認

### Phase 4: Watch Mode

- [ ] **Task 4.1**: Verify watcher supports subdirectories
  - [ ] 現在のwatcher実装を確認
  - [ ] サブディレクトリの変更が検知されるかテスト
  - [ ] 必要に応じて修正

### Phase 5: Integration & Cleanup

- [ ] **Task 5.1**: Run all tests and ensure they pass
  - [ ] `npm run test` ですべてのテストがパス

- [ ] **Task 5.2**: Manual testing
  - [ ] 実際にサーバーを起動してサブディレクトリのファイルにアクセス
  - [ ] ファイル一覧の表示を確認
  - [ ] Watchモードでサブディレクトリのファイル変更を確認

- [ ] **Task 5.3**: Code cleanup
  - [ ] 不要なコメントを削除
  - [ ] コードフォーマットを確認

## Notes

- 各タスクはTDD（テスト駆動開発）で実装する
- テストを先に書き、失敗することを確認してから実装する
- 1つのタスクが完了したら、チェックを入れてコミットする
