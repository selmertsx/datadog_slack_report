import { DatadogQueryResponse, SeriesMetrics } from "../../src/typings/datadog";

const product1Metrics: SeriesMetrics = {
  end: 1556719200000,
  attributes: {},
  metric: "system.cpu.user",
  interval: 3600,
  start: 1556636400000,
  length: 24,
  query_index: 0,
  aggr: "count",
  scope: "product:product1",
  pointlist: [[1556636400000, 3], [1556719200000, 3]],
  expression: "count:system.cpu.user{product:product1}.rollup(count, 3600)",
  unit: null,
  display_name: "system.cpu.user",
};

const product2Metrics: SeriesMetrics = {
  end: 1556719200000,
  attributes: {},
  metric: "system.cpu.user",
  interval: 3600,
  start: 1556636400000,
  length: 24,
  query_index: 0,
  aggr: "count",
  scope: "product:product2",
  pointlist: [[1556636400000, 1], [1556719200000, 1]],
  expression: "count:system.cpu.user{product:product2}.rollup(count, 3600)",
  unit: null,
  display_name: "system.cpu.user",
};

export const CountSystemCPUResponse: DatadogQueryResponse = {
  data: {
    series: [product1Metrics, product2Metrics],
  },
};
