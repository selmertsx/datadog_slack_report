/**
 * https://docs.datadoghq.com/ja/api/?lang=console#metrics-query
 *
 * Any query used for a graph can be used here. See here for more details.
 * The time between from and to should be less than 24 hours.
 * If it is longer, you will receive points with less granularity.
 */

import axios, { AxiosInstance } from "axios";
import { CountHostRequest, DatadogHostMetrics, DatadogQueryReponse, SeriesMetrics } from "./typings/datadog";

const APP_KEY: string = process.env.APP_KEY as string;
const API_KEY: string = process.env.API_KEY as string;

const requestParams = {
  baseURL: "https://api.datadoghq.com/api/v1/",
  timeout: 1000000,
};

const countHost = "count:system.cpu.user{*} by {product}.rollup(count, 3600)";
const countAPMHost = "count:datadog.apm.host_instance{*} by {host, product}.rollup(count, 3600)";

export class DatadogClient {
  private request: AxiosInstance;

  constructor() {
    this.request = axios.create(requestParams);
  }

  /**
   * datadogで監視しているhost数をカウントする
   *
   * @param from metricsを取得する際の開始時間
   * @param to metricsを取得する際の終了時間
   *
   * @returns [ { product: xxx, pointlists: Map<unixTime, countHosts > } ]
   */
  public async countHosts(from: string, to: string): Promise<DatadogHostMetrics[]> {
    const params: CountHostRequest = { api_key: API_KEY, application_key: APP_KEY, query: countHost, from, to };
    const res: DatadogQueryReponse = await this.request.get("/query", { params });

    return res.data.series.map((productsMetrics: SeriesMetrics) => {
      const pointlists = new Map<number, number>();
      for (const metrics of productsMetrics.pointlist) {
        pointlists.set(metrics[0], metrics[1]);
      }
      return { product: productsMetrics.scope.replace(/^product:/, ""), pointlists };
    });
  }

  /**
   * datadogで監視しているapmの数をカウントする
   *
   * @param from metricsを取得する際の開始時間
   * @param to metricsを取得する際の終了時間
   *
   * @returns [ { product: xxx, pointlists: Map<unixTime, countHosts > } ]
   */
  public async countAPMHosts(from: string, to: string): Promise<any> {
    const params: CountHostRequest = { api_key: API_KEY, application_key: APP_KEY, query: countAPMHost, from, to };
    const res: DatadogQueryReponse = await this.request.get("/query", { params });
    return res.data.series.map((productsMetrics: SeriesMetrics) => {
      console.log(productsMetrics);
    });
  }
}
