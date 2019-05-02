import { DatadogQueryResponse, SeriesMetrics } from "../../src/typings/datadog";

const product1Host1Response: SeriesMetrics = {
  end: 1556722799000,
  attributes: {},
  metric: "datadog.apm.host_instance",
  interval: 3600,
  start: 1556636400000,
  length: 24,
  query_index: 0,
  aggr: "count",
  scope: "host:i-hostID1,product:product1",
  pointlist: [[1556636400000, 1], [1556719200000, 1]],
  expression: "count:datadog.apm.host_instance{host:i-hostID1,product:product1}.rollup(count, 3600)",
  unit: null,
  display_name: "datadog.apm.host_instance",
};

const product1Host2Response: SeriesMetrics = {
  end: 1556722799000,
  attributes: {},
  metric: "datadog.apm.host_instance",
  interval: 3600,
  start: 1556636400000,
  length: 24,
  query_index: 0,
  aggr: "count",
  scope: "host:i-hostID2,product:product1",
  pointlist: [[1556636400000, 1], [1556719200000, 1]],
  expression: "count:datadog.apm.host_instance{host:i-hostID2,product:product1}.rollup(count, 3600)",
  unit: null,
  display_name: "datadog.apm.host_instance",
};

const product2Host3Response: SeriesMetrics = {
  end: 1556722799000,
  attributes: {},
  metric: "datadog.apm.host_instance",
  interval: 3600,
  start: 1556636400000,
  length: 24,
  query_index: 0,
  aggr: "count",
  scope: "host:i-hostID3,product:product2",
  pointlist: [[1556636400000, 1], [1556719200000, 1]],
  expression: "count:datadog.apm.host_instance{host:i-hostID3,product:product2}.rollup(count, 3600)",
  unit: null,
  display_name: "datadog.apm.host_instance",
};

export const CountAPMHostsResponse: DatadogQueryResponse = {
  data: {
    series: [product1Host1Response, product1Host2Response, product2Host3Response],
  },
};
