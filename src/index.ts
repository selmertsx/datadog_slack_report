import { DatadogClient } from "./DatadogClient";
import { ProductMetrics } from "./ProductMetrics";
import SlackMessage from "./SlackMessage";
import moment from "moment";
import { MessageAttachment } from "@slack/client";
import { SlackClient } from "./SlackClient";

const PRODUCT: string = process.env.PRODUCT as string;
const datadogClient = new DatadogClient();
const attachments: MessageAttachment[] = [];
const slackClient = new SlackClient();
const products: string[] = [PRODUCT];

async function datadog_handler(): Promise<void> {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 })
    .add(-1, "days")
    .format("X");
  const toTime = moment({ hour: 23, minute: 59, second: 59 }).format("X");

  for (const product of products) {
    const productMetrics: ProductMetrics = await datadogClient.countHosts(
      product,
      fromTime,
      toTime
    );
    attachments.push(SlackMessage.attachments(productMetrics));
  }
  await slackClient.post(attachments);
}

datadog_handler();
