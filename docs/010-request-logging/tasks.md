# Issue #10: Request Logging - Tasks

- [x] `src/logger.ts` に `requestLogger` ミドルウェアを実装する (TDD)
  - [x] テストファイル `tests/logger.test.ts` を作成する
  - [x] リクエスト完了時に標準出力にログが出力されることをテストする
  - [x] ログにタイムスタンプ、INFOレベル、メソッド、パス、ステータスコード、レスポンスタイムが含まれることをテストする
  - [x] `requestLogger` ミドルウェアを実装する
- [x] `src/server.ts` で `requestLogger` をミドルウェアとして登録する
- [x] 既存のテストがすべてパスすることを確認する
