/**
 * https://docs.datadoghq.com/ja/api/?lang=console#metrics-query
 *
 * Any query used for a graph can be used here. See here for more details.
 * The time between from and to should be less than 24 hours.
 * If it is longer, you will receive points with less granularity.
 */

import axios, { AxiosInstance } from "axios";
import { CountHostRequest, DatadogHostMetrics, DatadogQueryResponse, SeriesMetrics } from "./typings/datadog";

interface ProductHostSets {
  product: string;
  hostID: string;
  unixTimes: number[];
}

const APP_KEY: string = process.env.APP_KEY as string;
const API_KEY: string = process.env.API_KEY as string;

const RequestParams = {
  baseURL: "https://api.datadoghq.com/api/v1/",
  timeout: 1000000,
};

const CountHost = "count:system.cpu.user{*} by {product}.rollup(count, 3600)";
const CountAPMHost = "count:datadog.apm.host_instance{*} by {host, product}.rollup(count, 3600)";

export class DatadogClient {
  private request: AxiosInstance;

  constructor() {
    this.request = axios.create(RequestParams);
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
    const res: DatadogQueryResponse = await this.execQuery(CountHost, from, to);
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
   * @note datadog.apm.host_instanceのqueryを使ってデータを取得する際、理由はわからないが同一ホストにもかかわらずpointlistsが1以上になることがある。
   * apmはhost数課金なので、数値をそのまま足したりせずにproduct毎にhostをまとめて算出することにする。
   *
   * @param from metricsを取得する際の開始時間
   * @param to metricsを取得する際の終了時間
   *
   * @returns [ { product: xxx, pointlists: Map<unixTime, countHosts > } ]
   *
   */
  public async countAPMHosts(from: string, to: string): Promise<any> {
    const res: DatadogQueryResponse = await this.execQuery(CountAPMHost, from, to);
    const metrics = res.data.series.map((productsMetrics: SeriesMetrics) => {
      const unixTimes = productsMetrics.pointlist.map(point => point[0]);
      const [hostStr, productStr] = productsMetrics.scope.split(",");
      return {
        product: productStr.replace(/^product:/, ""),
        hostID: hostStr.replace(/^host:/, ""),
        unixTimes,
      };
    });

    return this.setAPMHostMetricsToMap(metrics);
  }

  private execQuery(query: string, from: string, to: string): Promise<DatadogQueryResponse> {
    const params: CountHostRequest = { api_key: API_KEY, application_key: APP_KEY, query, from, to };
    return this.request.get("/query", { params });
  }

  /**
   * @todo refactoring
   */
  private setAPMHostMetricsToMap(metrics: ProductHostSets[]) {
    const productHostMetricsMap = new Map();

    for (const productHostMetric of metrics) {
      const productName = productHostMetric.product;
      const pointLists = productHostMetricsMap.get(productName);
      if (!pointLists) {
        const newPointLists = new Map();
        for (const unixTime of productHostMetric.unixTimes) {
          newPointLists.set(unixTime, 1);
        }
        productHostMetricsMap.set(productName, newPointLists);
      } else {
        for (const unixTime of productHostMetric.unixTimes) {
          const hostCount = pointLists.get(unixTime) | 1;
          pointLists.set(unixTime, hostCount + 1);
        }
        productHostMetricsMap.set(productName, pointLists);
      }
    }

    return productHostMetricsMap;
  }
}
