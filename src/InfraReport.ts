import { Metrics } from "./typings/datadog";

export class InfraReport {
  constructor(public productName: string, public desiredHostCount: number, private metrics: Metrics) {}

  private get hostCounts(): number[] {
    return Array.from(this.metrics.values());
  }

  public get unixTimes(): number[] {
    return Array.from(this.metrics.keys());
  }

  public maxCount(): number {
    return Math.max.apply(null, this.hostCounts);
  }

  public minCount(): number {
    return Math.min.apply(null, this.hostCounts);
  }

  public getHostCount(unixTime: number): number | undefined {
    return this.metrics.get(unixTime);
  }

  public overCount(unixTime: number): number {
    const hostCount = this.metrics.get(unixTime);
    return (hostCount ? hostCount : 0) - this.desiredHostCount;
  }
}
