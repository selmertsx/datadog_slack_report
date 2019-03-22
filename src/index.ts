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

// cloud functionsの HTTP RequestがPATCHに対応してたらファンクション名変える
export async function update_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  const plan = new ReservedPlan("sample", 40);
  try {
    await client.updateReservedPlan(plan);
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(500).send(err);
  }
}

// cloud functionsの HTTP RequestがPOSTに対応してたらファンクション名変える
export async function create_reserved_plan(req: any, res: any): Promise<void> {
  const client = new FirestoreClient();
  const plan = new ReservedPlan("sample", 40);
  try {
    await client.postReservedPlan(plan);
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

// 予定を超過したプロダクトを通知する
export async function over_limit_products(): Promise<void> {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const toTime = moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X");

  const hostMetrics: DatadogHostMetrics[] = await datadogClient.countHosts(fromTime, toTime);
  const client = new FirestoreClient();
  const plans: ReservedPlan[] = await client.getReservedPlans();
}
