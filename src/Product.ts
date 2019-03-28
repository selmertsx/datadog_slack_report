import { PointList } from "./datadog";

type unixTime = number;
type hostNumber = number;

interface Metrics extends Map<unixTime, hostNumber> {}

export class Product {
  constructor(public name: string, public desiredHostCount: number, public metrics: Metrics) {}
}
