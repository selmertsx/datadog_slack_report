import moment from "moment";
import { InfraReport } from "../src/InfraReport";
import { InfraReports } from "../src/InfraReports";
import { DatadogHostMetrics, DatadogMonitoringPlan } from "../src/typings/datadog";
import { ProductReport } from "../src/typings/products";

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
    const products = InfraReports.create(reservedPlans, metrics);
    expect(products.list.get(sampleA.name)).toEqual(
      new InfraReport(sampleA.name, sampleA.plannedInfraHosts, sampleAMetrics.pointlists)
    );
    expect(products.list.get(sampleB.name)).toEqual(
      new InfraReport(sampleB.name, sampleB.plannedInfraHosts, sampleBMetrics.pointlists)
    );
  });
});

describe("exceededInfraProducts", () => {
  test("if datadog host metrics exceed planed number", () => {
    const infraReports = InfraReports.create(reservedPlans, metrics);
    const expectedResponse: ProductReport[] = [
      {
        productName: sampleA.name,
        plannedHost: sampleA.plannedInfraHosts,
        exceedHostCount: sampleA.maxInfraHosts - sampleA.plannedInfraHosts,
      },
    ];
    expect(infraReports.exceededInfraProducts()).toEqual(expectedResponse);
  });

  test("if datadog host metrics does not exceed planned number", () => {
    const infraReports = InfraReports.create(reservedPlans, metricsUnderLimit);
    expect(infraReports.exceededInfraProducts()).toEqual([]);
  });
});

describe("exceededInfraPeriods", () => {
  test("if datadog host metrics exceed planed number", () => {
    const infraReports = InfraReports.create(reservedPlans, metrics);
    expect(infraReports.exceededInfraPeriods()).toEqual([parseInt(firstTime, 10)]);
  });

  test("if datadog host metrics don't exceed planned number", () => {
    const infraReports = InfraReports.create(reservedPlans, metricsUnderLimit);
    expect(infraReports.exceededInfraPeriods()).toHaveLength(0);
  });
});
