import { Metric } from "./datadog";

export class ProductMetrics {
  name: string;
  metrics: Metric[];

  constructor(name: string, metrics: Metric[]) {
    this.name = name;
    this.metrics = metrics;
  }

  public maxHostCount() {
    return Math.max(...this.counts());
  }

  public minHostCount() {
    return Math.min(...this.counts());
  }

  private counts(): number[] {
    return this.metrics.map((metric: Metric) => metric.count);
  }
}
