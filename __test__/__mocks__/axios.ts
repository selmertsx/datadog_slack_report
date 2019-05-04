// https://jestjs.io/docs/ja/manual-mocks
// この手順に従ってManual Mockを行うことにする

const axios = jest.genMockFromModule("fs") as any;
let mockedResponse = Object.create(null);

function get(url: string, config: any) {
  const result = mockedResponse;
  mockedResponse = Object.create(null);
  return result;
}

function __setMockResponse(response: any) {
  mockedResponse = response;
}

function create(config: any) {
  return { get };
}

axios.create = create;
axios.__setMockResponse = __setMockResponse;
module.exports = axios;
