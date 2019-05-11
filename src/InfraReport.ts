import { Metrics } from "./typings/datadog";

export class InfraReport {
  constructor(public productName: string, public desiredHostCount: number, public metrics: Metrics) {}

  private get hostCounts(): number[] {
    return Array.from(this.metrics.values());
  }

  public get unixTimes(): number[] {
    return Array.from(this.metrics.keys());
  }

  public get maxCount(): number {
    return Math.max.apply(null, this.hostCounts);
  }

  public get minCount(): number {
    return Math.min.apply(null, this.hostCounts);
  }

  public overCount(unixTime: number): number {
    const hostCount = this.metrics.get(unixTime);
    return (hostCount ? hostCount : 0) - this.desiredHostCount;
  }
}
