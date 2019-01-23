import { MessageAttachment } from "@slack/client";
import { ProductMetrics } from "./ProductMetrics";

import moment from "moment-timezone";

interface SlackMessageFunctions {
  text(fromTime: string, toTime: string): string;
  attachments(productMetrics: ProductMetrics): MessageAttachment;
}

export const SlackMessage: SlackMessageFunctions = {
  attachments: (productMetrics: ProductMetrics) => {
    const text: string =
      `min:${productMetrics.minHostCount()} ~ max:${productMetrics.maxHostCount()}\n` +
      `sum(host*hours):${productMetrics.sum()}`;
    return {
      text,
      title: productMetrics.name,
    };
  },
  text(fromTime: string, toTime: string): string {
    return `
    datadog monitoring daily report
    ${moment.unix(parseInt(fromTime, 10))} ~ ${moment.unix(
      parseInt(toTime, 10),
    )}
    `;
  },
};
