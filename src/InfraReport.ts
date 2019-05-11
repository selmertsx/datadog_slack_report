import { Metrics } from "./typings/datadog";

export class InfraReport {
  constructor(public productName: string, public desiredHostCount: number, public metrics: Metrics) {}

  get maxCount(): number {
    const hostCounts = Array.from(this.metrics.values());
    return Math.max.apply(null, hostCounts);
  }

  public overCount(unixTime: number): number {
    const hostCount = this.metrics.get(unixTime);
    return (hostCount ? hostCount : 0) - this.desiredHostCount;
  }

  public unixTimes(): number[] {
    return Array.from(this.metrics.keys());
  }
}
