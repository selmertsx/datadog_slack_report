import { DatadogHostMetrics } from "../src/typings/datadog";

// @todo rename
export interface DatadogMetricsFactoryInput {
  maxInfraHosts: number;
  minInfraHosts: number;
  name: string;
  plannedInfraHosts: number;
}

// @todo 期間を渡せば、1時間単位のpointListsを自動で作るようにしたい
export function createExceededMetrics(
  firstTime: string,
  lastTime: string,
  data: DatadogMetricsFactoryInput,
): DatadogHostMetrics {
  return {
    pointlists: new Map([[parseInt(firstTime, 10), data.maxInfraHosts], [parseInt(lastTime, 10), data.minInfraHosts]]),
    product: data.name,
  };
}

export function createLowerMetrics(
  firstTime: string,
  lastTime: string,
  data: DatadogMetricsFactoryInput,
): DatadogHostMetrics {
  return {
    pointlists: new Map([
      [parseInt(firstTime, 10), data.plannedInfraHosts],
      [parseInt(lastTime, 10), data.plannedInfraHosts],
    ]),
    product: data.name,
  };
}
