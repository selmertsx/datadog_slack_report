# datadog_slack_report
Datadogで監視しているサーバー台数をいい感じにまとめてslack通知してくれる Cloud Function

## 環境変数の設定

`cp .env.yaml.sample .env.yaml`というコマンドを実行した後、下記の環境変数に一致する値をDatadogやSlackなどから取ってきて埋める。

```
APP_KEY: xxx # DatadogのAPP Key
API_KEY: xxx # DatadogのAPI Key
SlackToken: xxx # SlackのToken
CHANNEL_ID: xxx # Slackで通知したいchannel ID
```

## Localでの動作確認方法

```
$ npm run build
$ npx functions start
$ npx functions deploy datadog_handler --trigger-topic=datadog_report
$ npx functions call datadog_handler
```

現状は上記のコマンドをまとめて、`bin/local` に格納している。
操作が終わったら `npx functions stop` を実行する。

## 備考

このコードはOSSとしての正しさよりも、僕の興味を満たすためであったり、学習であったり、心理的安全性のために書かれています。
なので、ちゃんとメンテナンスするつもりはありませんし、コミットメッセージに気を使うこともありません。
