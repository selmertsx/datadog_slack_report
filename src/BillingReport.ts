import moment from "moment-timezone";
import { OverProductsMap } from "./datadog";

export class BillingReport {
  constructor(private fromTime: string, private toTime: string, private overProductsMap: OverProductsMap) {}

  public monitoredTime(): string {
    const fromTime = moment
      .unix(parseInt(this.fromTime, 10))
      .format("LLL")
      .toString();
    const toTime = moment
      .unix(parseInt(this.toTime, 10))
      .format("LLL")
      .toString();

    return `${fromTime} ~ ${toTime}`;
  }
}
