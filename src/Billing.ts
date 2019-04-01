import { BillingReport } from "./BillingReport";

export class Billing {
  public additionalCollection(fromTime: number, toTime: number): BillingReport[] {
    return [new BillingReport("sample")];
  }
}
