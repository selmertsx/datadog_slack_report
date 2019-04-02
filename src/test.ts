import moment from "moment";

import { Billing } from "./Billing";

const fromTime = parseInt(
  moment({ hour: 0, minute: 0, second: 0 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X"),
  10
);

const toTime = parseInt(
  moment({ hour: 23, minute: 59, second: 59 })
    .tz("Asia/Tokyo")
    .subtract(1, "days")
    .format("X"),
  10
);

const billing = new Billing();

async () => {
  await billing.calculate(fromTime, toTime);
};
