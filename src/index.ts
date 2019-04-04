import moment from "moment-timezone";
import "source-map-support/register";
import { Billing } from "./Billing";
import { DatadogHostMetrics, ReservedPlan } from "./datadog";
import { DatadogClient } from "./DatadogClient";
import { FirestoreClient } from "./FirestoreClient";
import { SlackClient } from "./SlackClient";
import { slackMessageBlock } from "./SlackMessageBlock";

const datadogClient = new DatadogClient();
const slackClient = new SlackClient();

export async function datadog_handler(): Promise<void> {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const toTime = moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const billing = new Billing();
  const report = await billing.calculate(fromTime, toTime);
  await slackClient.post(report.slackMessageDetail());
}

// cloud functionsの HTTP RequestがPATCHに対応してたらファンクション名変える
export async function update_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  try {
    await client.updateReservedPlan("sample", 40);
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(500).send(err);
  }
}

// cloud functionsの HTTP RequestがPOSTに対応してたらファンクション名変える
export async function create_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  try {
    await client.postReservedPlan("sample", 40);
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(500).send(err);
  }
}

// cloud functionsの HTTP RequestがDELETEに対応してたらファンクション名変える
export async function delete_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  try {
    await client.deleteReservedPlan("sample");
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(500).send(err);
  }
}
