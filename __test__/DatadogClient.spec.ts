import axios from "axios";
import moment from "moment";
import { CountAPMHostsResponse } from "../__test__/mocked/DatadogAPMResponse";
import { CountSystemCPUResponse } from "../__test__/mocked/DatadogSystemCPUMetrics";
import { DatadogClient } from "../src/DatadogClient";

jest.mock("axios");

const fromTime = moment({ years: 2018, months: 11, days: 18, hours: 9, minutes: 0, seconds: 0 }).format("x");
const toTime = moment({ years: 2018, months: 11, days: 18, hours: 10, minutes: 0, seconds: 0 }).format("x");
const client = new DatadogClient();

describe("countHosts", () => {
  test("", () => {
    (axios as any).__setMockResponse(CountSystemCPUResponse);

    const expected = [];
    expected.push({ product: "product1", pointlists: new Map([[1556636400000, 3], [1556719200000, 3]]) });
    expected.push({ product: "product2", pointlists: new Map([[1556636400000, 1], [1556719200000, 1]]) });
    return expect(client.countHosts(fromTime, toTime)).resolves.toEqual(expected);
  });
});

describe("countAPMHosts", () => {
  test("", () => {
    // 外部からmockするResponseを指定することはできるようになったけれども、これはFactoryで設定できた方が良い気がする。
    (axios as any).__setMockResponse(CountAPMHostsResponse);
    const expected = new Map();
    expected.set("product1", new Map([[1556636400000, 2], [1556719200000, 2]]));
    expected.set("product2", new Map([[1556636400000, 1], [1556719200000, 1]]));
    return expect(client.countAPMHosts(fromTime, toTime)).resolves.toEqual(expected);
  });
});
