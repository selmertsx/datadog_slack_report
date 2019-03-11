/** @jsx JSXSlack.h */
import JSXSlack, { Block, Section } from "@speee-js/jsx-slack";
import moment from "moment-timezone";
import { DatadogHostMetrics } from "./datadog";
import { ProductMetrics } from "./ProductMetrics";

// NOTE: ProductMetricsはコレクションパターンをすると良さそう
export function slackMessageBlock(fromTime: string, toTime: string, hostMetrics: DatadogHostMetrics[]) {
  const messages = [];
  for (const metrics of hostMetrics) {
    const productMetrics = new ProductMetrics(metrics);
    const message = (
      <blockquote>
        <b> {productMetrics.name} </b>
        <br />
        min:{productMetrics.minHostCount()} ~ max:{productMetrics.maxHostCount()}
        sum(host*hours):{productMetrics.sum()}
      </blockquote>
    );
    messages.push(message);
  }

  return JSXSlack(
    <Block>
      <Section>
        <p>datadog monitoring daily report</p>
        {moment.unix(parseInt(fromTime, 10)).toString()} ~ {moment.unix(parseInt(toTime, 10)).toString()}
        {messages}
      </Section>
    </Block>
  );
}
