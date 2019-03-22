import moment from "moment-timezone";
import "source-map-support/register";
import { DatadogHostMetrics } from "./datadog";
import { DatadogClient } from "./DatadogClient";
import { FirestoreClient } from "./FirestoreClient";
import { ReservedPlan } from "./ReservedPlan";
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

  const hostMetrics: DatadogHostMetrics[] = await datadogClient.countHosts(fromTime, toTime);
  const blocks = slackMessageBlock(fromTime, toTime, hostMetrics);
  await slackClient.post(blocks);
}

// cloud functionsの HTTP RequestってPOSTやPATCHに対応してたっけ？対応してたらファンクション名変えても良さそう。
export async function update_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  const plan = new ReservedPlan("sample", 40);
  try {
    await client.updateReservedPlan(plan);
    res.status(200).send("ok");
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function create_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  const plan = new ReservedPlan("sample", 40);
  try {
    await client.postReservedPlan(plan);
    res.status(200).send("ok");
  } catch (err) {
    res.status(500).send(err);
  }
}
