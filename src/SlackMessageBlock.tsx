/** @jsx JSXSlack.h */
import JSXSlack, { Block, Section } from "@speee-js/jsx-slack";
import moment from "moment-timezone";
import { DatadogHostMetrics } from "./datadog";
import { ProductMetrics } from "./ProductMetrics";

// TODO: SlackMessage classを消してここにロジックを寄せる
// TODO: 返り値を指定する
export function slackMessageBlock(fromTime: string, toTime: string, hostMetrics: DatadogHostMetrics[]) {
  const messages = [];
  for (const metrics of hostMetrics) {
    const productMetrics = new ProductMetrics(metrics);
    const text =
      `min:${productMetrics.minHostCount()} ~ max:${productMetrics.maxHostCount()}\n` +
      `sum(host*hours):${productMetrics.sum()}`;

    const message = (
      <blockquote>
        <b> {productMetrics.name} </b>
        <br />
        {text}
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
