import axios from "axios";
import moment from "moment";
import { CountAPMHostsResponse } from "../__test__/mocked/DatadogAPMResponse";
import { DatadogClient } from "../src/DatadogClient";

jest.mock("axios");

const fromTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const toTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
const client = new DatadogClient();

xdescribe("countHosts", () => {
  test("", () => {
    const expected = [];
    expected.push({ product: "product1" });
    return expect(client.countHosts(fromTime, toTime)).resolves.toEqual(expected);
  });
});
describe("countAPMHosts", () => {
  test("", () => {
    (axios as any).__setMockResponse(CountAPMHostsResponse);

    const expected = new Map();
    expected.set("product1", new Map([[1556636400000, 2], [1556719200000, 2]]));
    expected.set("product2", new Map([[1556636400000, 1], [1556719200000, 1]]));
    return expect(client.countAPMHosts(fromTime, toTime)).resolves.toEqual(expected);
  });
});
