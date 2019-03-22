import moment from "moment";
import { DatadogHostMetrics } from "../src/datadog";
import { ReservedPlan } from "../src/ReservedPlan";

// tslint:disable: object-literal-sort-keys
const firstTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const lastTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
const sampleA = { maxHostCount: 40, minHostCount: 20, name: "sampleA", planedHost: 30 };
const sampleB = { maxHostCount: 30, minHostCount: 20, name: "sampleB", planedHost: 30 };
// tslint:enable: object-literal-sort-keys

const metrics: DatadogHostMetrics[] = [];
metrics.push({
  pointlists: [
    { count: sampleA.maxHostCount, unixTime: parseInt(firstTime, 10) },
    { count: sampleA.minHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: sampleA.name,
});

metrics.push({
  pointlists: [
    { count: sampleB.maxHostCount, unixTime: parseInt(firstTime, 10) },
    { count: sampleB.minHostCount, unixTime: parseInt(lastTime, 10) },
  ],
  product: sampleB.name,
});

const reservedPlans = [];
reservedPlans.push(new ReservedPlan(sampleA.name, sampleA.planedHost));
reservedPlans.push(new ReservedPlan(sampleB.name, sampleB.planedHost));
