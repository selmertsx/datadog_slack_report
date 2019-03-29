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

export interface DatadogHostMetrics {
  product: string;
  pointlists: Map<number, number>;
}

export interface ReservedPlan {
  productName: string;
  plannedHostCount: number;
}
