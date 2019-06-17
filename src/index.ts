import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import moment from "moment-timezone";
import "source-map-support/register";
import * as DatadogReport from "./DatadogReport";
import { SlackClient } from "./SlackClient";

export async function datadog_handler(event: APIGatewayEvent, context: Context, callback: Callback) {
  const datadogReport = await DatadogReport.fetchDatadogMetrics(fromTime(), toTime());
  const slackClient = new SlackClient();
  await slackClient.post(datadogReport.body());
  // await slackClient.post(apmReportsMessage.body());

  callback(null, {
    statusCode: 200,
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ status: 200, message: "OK" }),
  });
}

function fromTime() {
  return moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");
}

function toTime() {
  return moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");
}
