import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import moment from "moment-timezone";
import "source-map-support/register";

// import * as APMReportClient from "./APMReportClient";
import { DynamoDBClient } from "./DynamoDBClient";
import * as InfraReportClient from "./InfraReportClient";
import { SlackClient } from "./SlackClient";

export async function datadog_handler(event: any, context: any, callback: Callback) {
  const dynamoDBClient = new DynamoDBClient();
  const monitoringPlans = await dynamoDBClient.fetchMonitoringPlans();

  let i;
  for (i = 1; i < 10; i++) {
    const infraReport = await InfraReportClient.fetch(fromTime(i), toTime(i), monitoringPlans);
    // const apmReport = await APMReportClient.fetch(fromTime(i), toTime(i), monitoringPlans);

    const slackClient = new SlackClient();
    await slackClient.post(infraReport.body());
  }

  callback(null, {
    statusCode: 200,
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ status: 200, message: "OK" }),
  });
}

function fromTime(subtract: number): string {
  return moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(subtract, "days")
    .format("X");
}

function toTime(subtract: number): string {
  return moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(subtract, "days")
    .format("X");
}

// 取り急ぎの対応
(async () => await datadog_handler("a", "b", () => {}))();
