import { WebAPICallResult } from "@slack/client";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import moment from "moment-timezone";
import "source-map-support/register";
import { Billing } from "./Billing";
import { SlackClient } from "./SlackClient";

const slackClient = new SlackClient();

export async function datadog_handler(event: APIGatewayEvent, context: Context, callback: Callback) {
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
    // const report = await billing.calculate(fromTime, toTime);
    const result = {
      status: 200,
      message: "OK!!!!!",
    };

    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(result),
    });
  } catch (err) {
    throw new Error(err);
  }
}
