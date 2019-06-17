import moment from "moment";
import { InfraReports } from "../src/InfraReports";
import { DatadogHostMetrics, DatadogMonitoringPlan } from "../src/typings/datadog";
import { ProductReport } from "../src/typings/products";
import * as DatadogMetricsFactory from "./DatadogMetricsFactory";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const lastTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");

const sampleA: DatadogMetricsFactory.DatadogMetricsFactoryInput = {
  maxInfraHosts: 40,
  minInfraHosts: 20,
  name: "sampleA",
  plannedInfraHosts: 30,
};

const sampleB: DatadogMetricsFactory.DatadogMetricsFactoryInput = {
  maxInfraHosts: 30,
  minInfraHosts: 20,
  name: "sampleB",
  plannedInfraHosts: 30,
};
// tslint:enable: object-literal-sort-keys

const sampleAMetrics = DatadogMetricsFactory.createExceededMetrics(firstTime, lastTime, sampleA);
const sampleBMetrics = DatadogMetricsFactory.createExceededMetrics(firstTime, lastTime, sampleB);
const sampleAMetricsUnderLimit = DatadogMetricsFactory.createLowerMetrics(firstTime, lastTime, sampleA);
const sampleBMetricsUnderLimit = DatadogMetricsFactory.createLowerMetrics(firstTime, lastTime, sampleB);

const metrics: DatadogHostMetrics[] = [sampleAMetrics, sampleBMetrics];
const metricsUnderLimit: DatadogHostMetrics[] = [sampleAMetricsUnderLimit, sampleBMetricsUnderLimit];
const reservedPlans: DatadogMonitoringPlan[] = [
  { productName: sampleA.name, plannedInfraHosts: sampleA.plannedInfraHosts },
  { productName: sampleB.name, plannedInfraHosts: sampleB.plannedInfraHosts },
];

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
    expect(infraReports.exceededProducts()).toEqual(expectedResponse);
  });

  test("if datadog host metrics does not exceed planned number", () => {
    const infraReports = InfraReports.create(reservedPlans, metricsUnderLimit);
    expect(infraReports.exceededProducts()).toEqual([]);
  });
});
