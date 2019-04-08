import { WebAPICallResult } from "@slack/client";
import moment from "moment-timezone";
import "source-map-support/register";
import { Billing } from "./Billing";
import { SlackClient } from "./SlackClient";
import { APIGatewayProxyResult } from "aws-lambda";

const slackClient = new SlackClient();

export async function datadog_handler(event: AWSLambda.APIGatewayEvent, context: APIGatewayProxyResult) {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const toTime = moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const billing = new Billing();
  try {
    const report = await billing.calculate(fromTime, toTime);
    return console.log(report);
  } catch (err) {
    throw new Error(err);
  }
}
