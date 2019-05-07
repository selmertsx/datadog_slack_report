import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import moment from "moment-timezone";
import "source-map-support/register";
import { DatadogClient } from "./DatadogClient";
import { DynamoDBClient } from "./DynamoDBClient";
import { InfraReportsMessage } from "./InfraReportsMessage";
import { InfraReports } from "./InfraReports";
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
  const infraHosts = await datadogClient.fetchInfraHosts(fromTime, toTime);
  const apmHosts = await datadogClient.fetchAPMHosts(fromTime, toTime);

  const dynamoDBClient = new DynamoDBClient();
  const monitoringPlans = await dynamoDBClient.fetchMonitoringPlans();

  const billingReports = InfraReports.create(monitoringPlans, infraHosts);

  const message = new InfraReportsMessage(
    fromTime,
    toTime,
    billingReports.exceededPeriods(),
    billingReports.exceededProducts()
  );

  const slackClient = new SlackClient();
  await slackClient.post(message.body());

  callback(null, {
    statusCode: 200,
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ status: 200, message: "OK" }),
  });
}
