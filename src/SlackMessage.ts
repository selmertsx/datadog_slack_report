import { MessageAttachment } from "@slack/client";
import { ProductMetrics } from "./ProductMetrics";

interface SlackMessageFunctions {
  attachments(productMetrics: ProductMetrics): MessageAttachment;
}

const SlackMessage: SlackMessageFunctions = {
  attachments: (productMetrics: ProductMetrics) => {
    const text: string = `min${productMetrics.minHostCount()} ~ max${productMetrics.maxHostCount()}`;

    return {
      text,
      title: productMetrics.name,
    };
  },
};

export = SlackMessage;
