export interface CountHostRequest {
  from: string;
  to: string;
  query: string;
  application_key: string;
  api_key: string;
}

export interface SeriesMetrics {
  end: number;
  attributes: any;
  metric: string;
  interval: number;
  start: number;
  length: number;
  query_index: number;
  aggr: string;
  scope: string;
  pointlist: PointList[];
  expression: string;
  display_name: string;
  unit: null;
}

export type PointList = [number, number];
export type UnixTime = number;
export type CountedHost = number;
export type HostNumber = number;
export type ProductName = string;

export type PointListMap = Map<UnixTime, CountedHost>;

export type ProductHostMetricsMap = Map<ProductName, PointListMap>;

export interface ProductHostSets {
  product: ProductName;
  hostID: string;
  unixTimes: UnixTime[];
}

export interface DatadogQueryResponse {
  data: {
    series: SeriesMetrics[];
  };
}

export interface Metrics extends Map<UnixTime, HostNumber> {}

export interface DatadogHostMetrics {
  product: ProductName;
  pointlists: Metrics;
}

export interface DatadogMonitoringPlan {
  productName: ProductName;
  plannedInfraHosts: number;
}

/**
 * Map interface that is consisted of product name key and monitored host count value.
 * This interface is used to get host counts for each product and for each unix time.
 * **e.g. Map<'productA', 24>**
 */

export interface ProductHostMap extends Map<ProductName, HostNumber> {}

/**
 *
 */

export interface OverProductsMap extends Map<UnixTime, ProductHostMap> {}
