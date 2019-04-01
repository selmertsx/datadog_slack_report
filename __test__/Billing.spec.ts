import moment from "moment";
import { Billing } from "../src/Billing";
import { BillingReport } from "../src/BillingReport";

const fromTime = parseInt(
  moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x"),
  10
);

const toTime = parseInt(
  moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x"),
  10
);

describe("calculate", () => {
  test("", () => {
    const billing = new Billing();
    const billingReport = new BillingReport("sample");
    expect(billing.calculate(fromTime, toTime)).toEqual([billingReport]);
  });
});
