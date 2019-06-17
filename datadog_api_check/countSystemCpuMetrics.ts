import axios, { AxiosInstance } from "axios";
import moment from "moment-timezone";

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

const fromTime = moment({ hour: 0, minute: 0, second: 0 })
  .tz("Asia/Tokyo")
  .subtract(1, "days")
  .format("X");

const toTime = moment({ hour: 23, minute: 59, second: 59 })
  .tz("Asia/Tokyo")
  .subtract(1, "days")
  .format("X");

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

  public async countHosts(from: string, to: string) {
    const params = { ...getRequestParams, from, to };
    const res = await this.request.get("/query", { params });
    return res.data.series.map((productsMetrics: any) => {
      console.log(productsMetrics);
    });
  }
}

(async () => {
  const client = new DatadogClient();
  await client.countHosts(fromTime, toTime);
})();
