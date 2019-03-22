import { DatadogHostMetrics, PointList } from "./datadog";

/**
 * @todo This class can be replaced with Products class, if datadog_report function will be able to report in detail
 */
export class ProductMetrics {
  public metrics: PointList[];
  public name: string;
  private counts: number[] | undefined;

  constructor(metrics: DatadogHostMetrics) {
    this.name = metrics.product;
    this.metrics = metrics.pointlists;
    this.counts = undefined;
  }

  get hostCounts(): number[] {
    if (!this.counts) {
      this.counts = this.metrics.map((metric: PointList) => metric.count);
    }

    return this.counts;
  }

  public maxHostCount(): number {
    return Math.max(...this.hostCounts);
  }

  public minHostCount(): number {
    return Math.min(...this.hostCounts);
  }

  public sum(): number {
    return this.hostCounts.reduce((total, num) => total + num);
  }
}
