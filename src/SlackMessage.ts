import { MessageAttachment } from "@slack/client";
import { ProductMetrics } from "./ProductMetrics";

import moment from "moment-timezone";

interface SlackMessageFunctions {
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
};
