import { SlackMessage } from '../src/SlackMessage';
import { ProductMetrics } from '../src/ProductMetrics';
import { DatadogHostMetrics } from '../src/datadog';

import moment from "moment";

const firstTime = moment({years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0}).format("x");
const lastTime = moment({years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0}).format("x");
const maxHostCount = 40;
const minHostCount = 20;
const metrics: DatadogHostMetrics = {
  product: "sample",
  pointlists: [
    {
      unixTime: parseInt(firstTime),
      count: minHostCount,
    },
    {
      unixTime: parseInt(lastTime),
      count: maxHostCount,
    }
  ]
}

const title = metrics.product;
const productMetrics = new ProductMetrics(metrics);
const text: string =
  "min:${productMetrics.minHostCount()} ~ max:${productMetrics.maxHostCount()}\n"
  + "sum(host*hours):${productMetrics.sum()}";

describe("attachments", () => {
  it("normal condition", () => {
    const message = SlackMessage.attachments(productMetrics)
    expect(message.title).toEqual(title)
    expect(message.text).toEqual(text);
  });
});
