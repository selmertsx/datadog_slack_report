import moment from "moment";
import { DatadogHostMetrics } from "../src/datadog";
import { Product } from "../src/Product";
import { Products } from "../src/Products";
import { ReservedPlan } from "../src/ReservedPlan";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const lastTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
const sampleA = { maxHostCount: 40, minHostCount: 20, name: "sampleA", planedHostNumber: 30 };
const sampleB = { maxHostCount: 30, minHostCount: 20, name: "sampleB", planedHostNumber: 30 };
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

const metrics: DatadogHostMetrics[] = [sampleAMetrics, sampleBMetrics];

const reservedPlans: ReservedPlan[] = [
  new ReservedPlan(sampleA.name, sampleA.planedHostNumber),
  new ReservedPlan(sampleB.name, sampleB.planedHostNumber),
];

describe("create", () => {
  test("", () => {
    const products = Products.create(reservedPlans, metrics);
    expect(products.list.get(sampleA.name)).toEqual(
      new Product(sampleA.name, sampleA.planedHostNumber, sampleAMetrics.pointlists)
    );
    expect(products.list.get(sampleB.name)).toEqual(
      new Product(sampleB.name, sampleB.planedHostNumber, sampleBMetrics.pointlists)
    );
  });
});
