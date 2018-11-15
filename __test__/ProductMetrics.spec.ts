import { ProductMetrics } from '../src/ProductMetrics';
import { DatadogHostMetrics } from '../src/datadog';
import moment, { max } from "moment";

const firstTime = moment({years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0}).format("x");
const lastTime = moment({years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0}).format("x");
const maxHostCount = 40;
const minHostCount = 20;

const metrics: DatadogHostMetrics = {
  product: "sample",
  pointlists: [
    {
      unixTime: parseInt(firstTime),
      count: 20,
    },
    {
      unixTime: parseInt(lastTime),
      count: 40,
    }
  ]
}

const productMetrics = new ProductMetrics(metrics);

describe("maxHostCount", () => {
  it("normal conditions", () => {
    expect(productMetrics.maxHostCount()).toEqual(maxHostCount);
  });
});

describe("minHostCount", () => {
  it("normal conditions", () => {
    expect(productMetrics.minHostCount()).toEqual(minHostCount);
  });
});

describe("sum", () => {
  it("normal conditions", () => {
    expect(productMetrics.sum()).toEqual(maxHostCount + minHostCount);
  });
});
