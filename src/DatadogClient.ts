import axios, { AxiosInstance } from "axios";
import { CountHostRequest, DatadogHostMetrics, DatadogQueryReponse, PointList, SeriesMetrics } from "./datadog";

const APP_KEY: string = process.env.APP_KEY as string;
const API_KEY: string = process.env.API_KEY as string;

interface RequestParams {
  baseURL: string;
  timeout: number;
}

const requestParams: RequestParams = {
  baseURL: "https://api.datadoghq.com/api/v1/",
  timeout: 1000000,
};

const getRequestParams = {
  api_key: API_KEY,
  application_key: APP_KEY,
  query: "count:system.cpu.user{*} by {product}.rollup(count, 3600)",
};

export class DatadogClient {
  private request: AxiosInstance;

  constructor() {
    this.request = axios.create(requestParams);
  }

  public async countHosts(from: string, to: string): Promise<DatadogHostMetrics[]> {
    const params: CountHostRequest = { ...getRequestParams, from, to };
    const res: DatadogQueryReponse = await this.request.get("/query", { params });

    return res.data.series.map((product: SeriesMetrics) => {
      const pointlists: PointList[] = product.pointlist.map((point: number[]) => ({
        unixTime: point[0],
        count: point[1],
      }));
      return { product: product.scope, pointlists };
    });
  }
}
