import { ProductMetrics } from "./ProductMetrics";
import { MessageAttachment } from "@slack/client";

interface SlackMessageFunctions {
  attachments(productMetrics: ProductMetrics): MessageAttachment;
}

const SlackMessage: SlackMessageFunctions = {
  attachments: (productMetrics: ProductMetrics) => {
    const text: string = `min${productMetrics.minHostCount()} ~ max${productMetrics.maxHostCount()}`;
    return {
      title: productMetrics.name,
      text
    };
  }
};

export = SlackMessage;
