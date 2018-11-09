import { MessageAttachment } from "@slack/client";
import moment from "moment-timezone";
import { DatadogClient } from "./DatadogClient";
import { ProductMetrics } from "./ProductMetrics";
import { SlackClient } from "./SlackClient";
import SlackMessage from "./SlackMessage";

const PRODUCT: string = process.env.PRODUCT as string;
const datadogClient = new DatadogClient();
const attachments: MessageAttachment[] = [];
const slackClient = new SlackClient();
const products: string[] = [PRODUCT];

async function datadog_handler(): Promise<void> {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 }).subtract(1, "days").format("X");
  const toTime = moment({ hour: 23, minute: 59, second: 59 }).subtract(1, "days").format("X");

  for (const product of products) {
    const productMetrics: ProductMetrics = await datadogClient.countHosts(product, fromTime, toTime);
    attachments.push(SlackMessage.attachments(productMetrics));
  }
  await slackClient.post(attachments);
}

datadog_handler();
