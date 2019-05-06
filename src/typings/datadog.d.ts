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

type PointList = [number, number];
type UnixTime = number;
type CountedHost = number;
type HostNumber = number;
type ProductName = string;
type PointListMap = Map<UnixTime, CountedHost>;

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

export interface ReservedPlan {
  productName: ProductName;
  plannedHostCount: number;
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

/**
 *
 */
export interface ProductReport {
  name: ProductName;
  exceedHostCount: number;
  plannedHost: number;
}
