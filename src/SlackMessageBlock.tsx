/** @jsx JSXSlack.h */
import JSXSlack, { Block, Divider, Field, Section } from "@speee-js/jsx-slack";
import moment from "moment-timezone";
import { DatadogHostMetrics } from "./datadog";
import { ProductMetrics } from "./ProductMetrics";

// NOTE: ProductMetricsはコレクションパターンをすると良さそう
export function slackMessageBlock(fromTime: string, toTime: string, hostMetrics: DatadogHostMetrics[]) {
  const messages = [];
  for (const metrics of hostMetrics) {
    const productMetrics = new ProductMetrics(metrics);
    const message = (
      <Field>
        <b> {productMetrics.name} </b>
        <br />
        min:{productMetrics.minHostCount()} <br />
        max:{productMetrics.maxHostCount()} <br />
        sum(host*hours):{productMetrics.sum()}
      </Field>
    );

    messages.push(message);
  }

  return JSXSlack(
    <Block>
      <Section>
        <b>datadog monitoring daily report</b> <br />
        {moment.unix(parseInt(fromTime, 10)).toString()} ~ {moment.unix(parseInt(toTime, 10)).toString()}
      </Section>
      <Divider />
      <Section> {messages} </Section>
    </Block>
  );
}
