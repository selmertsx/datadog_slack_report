import axios from "axios";
import { DatadogClient } from "../src/DatadogClient";

jest.mock("axios");

const countAPMHostsResponse = [];

describe("countHosts", () => {});
describe("countAPMHosts", () => {
  (axios.get as jest.Mock).mockResolvedValue(countAPMHostsResponse);
});
