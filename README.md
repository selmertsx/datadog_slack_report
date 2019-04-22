# datadog_slack_report

Datadogで監視しているサーバー台数をいい感じにまとめてslack通知してくれる AWS Lambda Function

## 環境変数の設定

`cp .env.yaml.sample .env.yaml`というコマンドを実行した後、下記の環境変数に一致する値をDatadogやSlackなどから取ってきて埋める。

```
APP_KEY: xxx # DatadogのAPP Key
API_KEY: xxx # DatadogのAPI Key
SLACK_TOKEN: xxx # SlackのToken
CHANNEL_ID: xxx # Slackで通知したいchannel ID
```

## DynamoDB Localの環境構築


```
docker-compose up
```

## テストデータの投入

```
aws dynamodb create-table \
  --table-name DatadogPlan \
  --attribute-definitions \
    AttributeName=Product,AttributeType=S \
  --key-schema AttributeName=Product,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --endpoint-url http://localhost:8000

aws dynamodb batch-write-item --request-items file://$(pwd)/tmp/datadog-import.json  --endpoint-url http://localhost:8000
```

## Localでの動作確認方法
### DynamoDBのデータをGUIから確認する

```
npm run dynamodb-admin
```

https://www.npmjs.com/package/dynamodb-admin

### Lambdaの起動
```
$ npm run build
$ sam local invoke DatadogReport -e events/event_apigateway.json
```

## Datadog APIの制限

https://docs.datadoghq.com/ja/api/?lang=console#metrics-query

> Any query used for a graph can be used here. See here for more details. The time between from and to should be less than 24 hours. If it is longer, you will receive points with less granularity.

上記の問題から、DatadogのAPIは常に24時間未満の範囲で実行しなければならない。
