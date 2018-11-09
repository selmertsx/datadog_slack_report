export interface CountHostRequest {
  from: string;
  to: string;
  query: string;
  application_key: string;
  api_key: string;
}

export interface Metric {
  unixTime: number;
  count: number;
}
