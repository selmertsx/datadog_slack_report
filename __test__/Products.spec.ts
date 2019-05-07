import moment from "moment";
import { Product } from "../src/Product";
import { Products } from "../src/Products";
import { DatadogHostMetrics, DatadogMonitoringPlan, ProductReport } from "../src/typings/datadog";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const lastTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
const sampleA = { maxInfraHosts: 40, minInfraHosts: 20, name: "sampleA", plannedInfraHosts: 30 };
const sampleB = { maxInfraHosts: 30, minInfraHosts: 20, name: "sampleB", plannedInfraHosts: 30 };
// tslint:enable: object-literal-sort-keys

const sampleAMetrics = {
  pointlists: new Map([
    [parseInt(firstTime, 10), sampleA.maxInfraHosts],
    [parseInt(lastTime, 10), sampleA.minInfraHosts],
  ]),
  product: sampleA.name,
};

const sampleBMetrics = {
  pointlists: new Map([
    [parseInt(firstTime, 10), sampleB.maxInfraHosts],
    [parseInt(lastTime, 10), sampleB.minInfraHosts],
  ]),
  product: sampleB.name,
};

const sampleAMetricsUnderLimit = {
  pointlists: new Map([
    [parseInt(firstTime, 10), sampleA.minInfraHosts],
    [parseInt(lastTime, 10), sampleA.minInfraHosts],
  ]),
  product: sampleA.name,
};

const sampleBMetricsUnderLimit = {
  pointlists: new Map([
    [parseInt(firstTime, 10), sampleB.minInfraHosts],
    [parseInt(lastTime, 10), sampleB.minInfraHosts],
  ]),
  product: sampleB.name,
};

const metrics: DatadogHostMetrics[] = [sampleAMetrics, sampleBMetrics];
const metricsUnderLimit: DatadogHostMetrics[] = [sampleAMetricsUnderLimit, sampleBMetricsUnderLimit];

const reservedPlans: DatadogMonitoringPlan[] = [
  { productName: sampleA.name, plannedInfraHosts: sampleA.plannedInfraHosts },
  { productName: sampleB.name, plannedInfraHosts: sampleB.plannedInfraHosts },
];

describe("create", () => {
  test("", () => {
    const products = Products.create(reservedPlans, metrics);
    expect(products.list.get(sampleA.name)).toEqual(
      new Product(sampleA.name, sampleA.plannedInfraHosts, sampleAMetrics.pointlists)
    );
    expect(products.list.get(sampleB.name)).toEqual(
      new Product(sampleB.name, sampleB.plannedInfraHosts, sampleBMetrics.pointlists)
    );
  });
});

describe("overPlanProducts", () => {
  test("if datadog host metrics exceed planed number", () => {
    const products = Products.create(reservedPlans, metrics);
    const expectedResponse: ProductReport[] = [
      {
        name: sampleA.name,
        plannedHost: sampleA.plannedInfraHosts,
        exceedHostCount: sampleA.maxInfraHosts - sampleA.plannedInfraHosts,
      },
    ];
    expect(products.overPlanProducts()).toEqual(expectedResponse);
  });

  test("if datadog host metrics does not exceed planned number", () => {
    const products = Products.create(reservedPlans, metricsUnderLimit);
    expect(products.overPlanProducts()).toEqual([]);
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
