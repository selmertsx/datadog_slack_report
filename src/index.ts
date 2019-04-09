import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import moment from "moment-timezone";
import "source-map-support/register";
import { Billing } from "./Billing";
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

  try {
    const billing = new Billing();
    const report = await billing.calculate(fromTime, toTime);
    const slackClient = new SlackClient();
    await slackClient.post(report.slackMessageDetail());

    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ status: 200, message: "OK" }),
    });
  } catch (err) {
    throw new Error(err);
  }
}
