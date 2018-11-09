import { DatadogHostMetrics, PointList } from "./datadog";

export class ProductMetrics {
  private _metrics: PointList[];
  private _name: string;
  private _counts: number[] | undefined;

  constructor(metrics: DatadogHostMetrics) {
    this._name = metrics.product;
    this._metrics = metrics.pointlists;
    this._counts = undefined;
  }

  get name() {
    return this._name;
  }

  get metrics() {
    return this._metrics;
  }

  get counts(): number[] {
    if (!this._counts) {
      this._counts = this.metrics.map((metric: PointList) => metric.count);
    }

    return this._counts;
  }

  public maxHostCount():number{
    return Math.max(...this.counts);
  }

  public minHostCount():number{
    return Math.min(...this.counts);
  }

  public sum(): number {
    return this.counts.reduce((total, num) => total + num);
  }
}
