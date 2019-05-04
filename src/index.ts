import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import moment from "moment-timezone";
import "source-map-support/register";
import { BillingReport } from "./BillingReport";
import { DatadogClient } from "./DatadogClient";
import { DynamoDBClient } from "./DynamoDBClient";
import { Products } from "./Products";
import { SlackClient } from "./SlackClient";

export async function datadog_handler(event: APIGatewayEvent, context: Context, callback: Callback) {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const toTime = moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const datadogClient = new DatadogClient();
  const datadogHostMetrics = await datadogClient.countHosts(fromTime, toTime);
  const datadogAPMHostMap = await datadogClient.countAPMHosts(fromTime, toTime);

  const dynamoDBClient = new DynamoDBClient();
  const reservedPlans = await dynamoDBClient.getReservedPlans();

  const products = Products.create(reservedPlans, datadogHostMetrics);
  const report = new BillingReport(fromTime, toTime, products.overPeriod(), products.overPlanProducts());

  const slackClient = new SlackClient();
  await slackClient.post(report.slackMessageDetail());

  callback(null, {
    statusCode: 200,
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ status: 200, message: "OK" }),
  });
}
