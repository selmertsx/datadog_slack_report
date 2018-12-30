# datadog_slack_report
Datadogで監視しているサーバー台数をいい感じにまとめてslack通知してくれる Cloud Function

## 初期設定

`cp .env.yaml.sample .env.yaml`

## Localでの動作確認方法

```
$ npm run build
$ npx functions start
$ npx functions deploy datadog_handler --trigger-topic=datadog_report
$ npx functions call datadog_handler
```

現状は上記のコマンドをまとめて、`bin/local` に格納している。
操作が終わったら `npx functions stop` を実行する。
