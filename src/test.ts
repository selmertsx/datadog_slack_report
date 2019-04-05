import moment from "moment-timezone";
import { Billing } from "./Billing";
import { SlackClient } from "./SlackClient";

const fromTime = moment({ hour: 0, minute: 0, second: 0 })
  .tz("Asia/Tokyo")
  .subtract(1, "days")
  .format("X");

const toTime = moment({ hour: 23, minute: 59, second: 59 })
  .tz("Asia/Tokyo")
  .subtract(1, "days")
  .format("X");

const billing = new Billing();

async function main() {
  const report = await billing.calculate(fromTime, toTime);
  try {
    const slackClient = new SlackClient();
    await slackClient.post(report.slackMessageDetail());
  } catch (err) {
    console.log(err);
  }
}

main();
