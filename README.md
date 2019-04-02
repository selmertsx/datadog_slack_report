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

## Datadog APIの制限

https://docs.datadoghq.com/ja/api/?lang=console#metrics-query

> Any query used for a graph can be used here. See here for more details. The time between from and to should be less than 24 hours. If it is longer, you will receive points with less granularity.

上記の問題から、DatadogのAPIは常に24時間未満の範囲で実行しなければならない。
