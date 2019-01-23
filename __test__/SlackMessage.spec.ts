import { DatadogHostMetrics } from "../src/datadog";
import { ProductMetrics } from "../src/ProductMetrics";
import { SlackMessage } from "../src/SlackMessage";

import moment from "moment";

// tslint:disable: object-literal-sort-keys
const fromTime = moment({
  years: 2018,
  months: 11,
  days: 18,
  hours: 9,
  minutes: 0,
  seconds: 0,
}).format("x");

const toTime = moment({
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
      unixTime: parseInt(fromTime, 10),
    },
    {
      count: maxHostCount,
      unixTime: parseInt(toTime, 10),
    },
  ],
  product: "sample",
};

describe("attachments", () => {
  it("normal condition", () => {
    const productMetrics = new ProductMetrics(metrics);
    const attachmentText: string =
      `min:${productMetrics.minHostCount()} ~ max:${productMetrics.maxHostCount()}\n` +
      `sum(host*hours):${productMetrics.sum()}`;

    const attachments = SlackMessage.attachments(productMetrics);
    expect(attachments.title).toEqual(metrics.product);
    expect(attachments.text).toEqual(attachmentText);
  });
});

describe("text", () => {
  it("normal condition", () => {
    const expected = `
    datadog monitoring daily report
    ${moment.unix(parseInt(fromTime, 10))} ~ ${moment.unix(
      parseInt(toTime, 10),
    )}
    `;

    const text = SlackMessage.text(fromTime, toTime);
    expect(text).toEqual(expected);
  });
});
