import { Metrics } from "./datadog";

export class Product {
  constructor(public name: string, public desiredHostCount: number, public metrics: Metrics) {}
}
