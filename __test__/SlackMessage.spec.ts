import { DatadogHostMetrics } from "../src/datadog";
import { ProductMetrics } from "../src/ProductMetrics";
import { SlackMessage } from "../src/SlackMessage";

import moment from "moment";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({
  years: 2018,
  months: 11,
  days: 18,
  hours: 9,
  minutes: 0,
  seconds: 0,
}).format("x");

const lastTime = moment({
  years: 2018,
  months: 11,
  days: 18,
  hours: 10,
  minutes: 0,
  seconds: 0,
}).format("x");
/* tslint:enable:object-literal-sort-keys */

const maxHostCount = 40;
const minHostCount = 20;
const metrics: DatadogHostMetrics = {
  pointlists: [
    {
      count: minHostCount,
      unixTime: parseInt(firstTime, 10),
    },
    {
      count: maxHostCount,
      unixTime: parseInt(lastTime, 10),
    },
  ],
  product: "sample",
};

const title = metrics.product;
const productMetrics = new ProductMetrics(metrics);
const text: string =
  `min:${productMetrics.minHostCount()} ~ max:${productMetrics.maxHostCount()}\n` +
  `sum(host*hours):${productMetrics.sum()}`;

describe("attachments", () => {
  it("normal condition", () => {
    const message = SlackMessage.attachments(productMetrics);
    expect(message.title).toEqual(title);
    expect(message.text).toEqual(text);
  });
});
