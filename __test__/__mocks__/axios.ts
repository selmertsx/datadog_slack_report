// https://jestjs.io/docs/ja/manual-mocks
// この手順に従ってManual Mockを行うことにする
import { CountAPMHostsResponse } from "../mocked/DatadogResponse";

const axios = jest.genMockFromModule("fs") as any;

function get(url: string, config: any) {
  return CountAPMHostsResponse;
}

function create(config: any) {
  return { get };
}

axios.create = create;
module.exports = axios;
