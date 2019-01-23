import axios, { AxiosInstance } from "axios";
import { CountHostRequest, DatadogHostMetrics, DatadogQueryReponse, PointList, SeriesMetrics } from "./datadog";

const APP_KEY: string = process.env.APP_KEY as string;
const API_KEY: string = process.env.API_KEY as string;

export class DatadogClient {
  public request: AxiosInstance;

  constructor() {
    this.request = axios.create({
      baseURL: "https://api.datadoghq.com/api/v1/",
      timeout: 1000000,
    });
  }

  public async countHosts(from: string, to: string): Promise<DatadogHostMetrics[]> {
    const params: CountHostRequest = {
      api_key: API_KEY,
      application_key: APP_KEY,
      from,
      query: `count:system.cpu.user{*} by {product}.rollup(count, 3600)`,
      to,
    };

    const res: DatadogQueryReponse = await this.request.get("/query", {
      params,
    });
    return res.data.series.map((product: SeriesMetrics) => {
      const pointlists: PointList[] = product.pointlist.map((point: number[]) => ({
        unixTime: point[0],
        count: point[1],
      }));
      return { product: product.scope, pointlists };
    });
  }
}
