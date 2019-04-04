export interface CountHostRequest {
  from: string;
  to: string;
  query: string;
  application_key: string;
  api_key: string;
}

export interface SeriesMetrics {
  scope: string;
  pointlist: [number[]];
}

export interface DatadogQueryReponse {
  data: {
    series: SeriesMetrics[];
  };
}

type unixTime = number;
type hostNumber = number;

export interface Metrics extends Map<unixTime, hostNumber> {}

export interface DatadogHostMetrics {
  product: string;
  pointlists: Metrics;
}

export interface ReservedPlan {
  productName: string;
  plannedHostCount: number;
}

type productName = string;

/**
 * Map interface that is consisted of product name key and monitored host count value.
 * This interface is used to get host counts for each product and for each unix time.
 * **e.g. Map<'productA', 24>**
 */
export interface ProductHostMap extends Map<productName, hostNumber> {}
