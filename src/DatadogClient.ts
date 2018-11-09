import axios, { AxiosInstance } from "axios";
import { CountHostRequest, Metric } from "./datadog";
import { ProductMetrics } from "./ProductMetrics";

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

  public async countHosts(
    product: string,
    from: string,
    to: string,
  ): Promise<ProductMetrics> {
    const params: CountHostRequest = {
      api_key: API_KEY,
      application_key: APP_KEY,
      from,
      query: `count_not_null(sum:system.cpu.user{product:${product}} by {host})`,
      to,
    };

    const res = await this.request.get("/query", { params });
    const pointlist = res.data.series[0].pointlist;
    const metrics: Metric[] = pointlist.map((point: number[]) => {
      return { unixTime: point[0], count: point[1] };
    });

    return new ProductMetrics(product, metrics);
  }
}