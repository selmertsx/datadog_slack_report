import moment from "moment";
import { DatadogHostMetrics } from '../../src/datadog';

const firstTime = moment({years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0}).format("x");
const lastTime = moment({years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0}).format("x");
const maxHostCount = 40;
const minHostCount = 20;

export const metrics: DatadogHostMetrics = {
  product: "sample",
  pointlists: [
    {
      unixTime: parseInt(firstTime),
      count: minHostCount,
    },
    {
      unixTime: parseInt(lastTime),
      count: maxHostCount,
    }
  ]
}
