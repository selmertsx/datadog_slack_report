import moment from "moment";
import { DatadogHostMetrics, ReservedPlan } from "../src/datadog";
import { Product } from "../src/Product";
import { Products } from "../src/Products";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const lastTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
const sampleA = { maxHostCount: 40, minHostCount: 20, name: "sampleA", plannedHostCount: 30 };
const sampleB = { maxHostCount: 30, minHostCount: 20, name: "sampleB", plannedHostCount: 30 };
// tslint:enable: object-literal-sort-keys
const sampleAMetrics = {
  pointlists: [
    { count: sampleA.maxHostCount, unixTime: parseInt(firstTime, 10) },
    { count: sampleA.minHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: sampleA.name,
};

const sampleBMetrics = {
  pointlists: [
    { count: sampleB.maxHostCount, unixTime: parseInt(firstTime, 10) },
    { count: sampleB.minHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: sampleB.name,
};

const sampleAMetricsUnderLimit = {
  pointlists: [
    { count: sampleA.minHostCount, unixTime: parseInt(firstTime, 10) },
    { count: sampleA.minHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: sampleA.name,
};

const sampleBMetricsUnderLimit = {
  pointlists: [
    { count: sampleB.minHostCount, unixTime: parseInt(firstTime, 10) },
    { count: sampleB.minHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: sampleB.name,
};

const metrics: DatadogHostMetrics[] = [sampleAMetrics, sampleBMetrics];
const metricsUnderLimit: DatadogHostMetrics[] = [sampleAMetricsUnderLimit, sampleBMetricsUnderLimit];

const reservedPlans: ReservedPlan[] = [
  { productName: sampleA.name, plannedHostCount: sampleA.plannedHostCount },
  { productName: sampleB.name, plannedHostCount: sampleB.plannedHostCount },
];

describe("create", () => {
  test("", () => {
    const products = Products.create(reservedPlans, metrics);
    expect(products.list.get(sampleA.name)).toEqual(
      new Product(sampleA.name, sampleA.plannedHostCount, sampleAMetrics.pointlists)
    );
    expect(products.list.get(sampleB.name)).toEqual(
      new Product(sampleB.name, sampleB.plannedHostCount, sampleBMetrics.pointlists)
    );
  });
});

describe("overPeriod", () => {
  test("if datadog host metrics exceed planed number", () => {
    const products = Products.create(reservedPlans, metrics);
    expect(products.overPeriod()).toEqual([parseInt(firstTime, 10)]);
  });

  test("if datadog host metrics don't exceed planned number", () => {
    const products = Products.create(reservedPlans, metricsUnderLimit);
    expect(products.overPeriod()).toHaveLength(0);
  });
});
