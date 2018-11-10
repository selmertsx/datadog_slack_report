import { MessageAttachment } from "@slack/client";
import moment from "moment-timezone";
import { DatadogClient } from "./DatadogClient";
import { ProductMetrics } from "./ProductMetrics";
import { SlackClient } from "./SlackClient";
import SlackMessage from "./SlackMessage";
import { DatadogHostMetrics } from './datadog';


const datadogClient = new DatadogClient();
const slackClient = new SlackClient();

export async function datadog_handler(data: any): Promise<void> {
  const fromTime = moment({ hour: 0, minute: 0, second: 0 }).tz("Asia/Tokyo").subtract(1, "days").format("X");
  const toTime = moment({ hour: 23, minute: 59, second: 59 }).tz("Asia/Tokyo").subtract(1, "days").format("X");
  const title = `
  datadog monitoring daily report
  ${moment.unix(parseInt(fromTime))} ~ ${moment.unix(parseInt(toTime))}
  `;

  const hostMetrics: DatadogHostMetrics[] = await datadogClient.countHosts(fromTime, toTime);
  const attachments: MessageAttachment[] = [];
  for (const metrics of hostMetrics) {
    const productMetrics = new ProductMetrics(metrics);
    attachments.push(SlackMessage.attachments(productMetrics));
  }

  await slackClient.post(title, attachments);
}
