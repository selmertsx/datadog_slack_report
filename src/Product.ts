import { Metrics } from "./typings/datadog";

export class Product {
  constructor(public name: string, public desiredHostCount: number, public metrics: Metrics) {}

  public overCount(unixTime: number) {
    const hostCount = this.metrics.get(unixTime);
    return (hostCount ? hostCount : 0) - this.desiredHostCount;
  }

  public unixTimes(): number[] {
    return Array.from(this.metrics.keys());
  }
}
