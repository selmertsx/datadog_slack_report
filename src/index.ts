import { MessageAttachment } from "@slack/client";
import moment from "moment-timezone";
import { DatadogClient } from "./DatadogClient";
import { ProductMetrics } from "./ProductMetrics";
import { SlackClient } from "./SlackClient";
import SlackMessage from "./SlackMessage";

const PRODUCTS: string = process.env.PRODUCTS as string;
const datadogClient = new DatadogClient();
const attachments: MessageAttachment[] = [];
const slackClient = new SlackClient();
const products: string[] = PRODUCTS.split(",");

async function datadog_handler(): Promise<void> {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 }).tz("Asia/Tokyo").subtract(1, "days").format("X");
  const toTime = moment({ hour: 23, minute: 59, second: 59 }).tz("Asia/Tokyo").subtract(1, "days").format("X");
  const title = `
  datadog monitoring daily report
  ${moment.unix(parseInt(fromTime))} ~ ${moment.unix(parseInt(toTime))}
  `;
  const metrics = await datadogClient.countHosts(fromTime, toTime);

  const productMetrics = new ProductMetrics(product, metrics);
  attachments.push(SlackMessage.attachments(productMetrics));

  await slackClient.post(title, attachments);
}

datadog_handler();
