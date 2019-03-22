import moment from "moment";
import { DatadogHostMetrics } from "../src/datadog";
import { ProductMetrics } from "../src/ProductMetrics";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const lastTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
// tslint:enable:object-literal-sort-keys

const maxHostCount = 40;
const minHostCount = 20;

const metrics: DatadogHostMetrics = {
  pointlists: [
    { count: minHostCount, unixTime: parseInt(firstTime, 10) },
    { count: maxHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: "sample",
};

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
