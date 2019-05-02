import moment from "moment";
import { DatadogClient } from "../src/DatadogClient";

jest.mock("axios");
const fromTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const toTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");

describe("countHosts", () => {});
describe("countAPMHosts", () => {
  test("", () => {
    const client = new DatadogClient();
    const expected = {
      product1: [new Map([[1556636400000, 2], [1556719200000, 2]])],
      product2: [new Map([[1556636400000, 1], [1556719200000, 1]])],
    };

    return expect(client.countAPMHosts(fromTime, toTime)).resolves.toEqual(expected);
  });
});
