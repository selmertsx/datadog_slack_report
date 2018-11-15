import { WebClient } from './__mocks__/@slack/client';
import { SlackClient } from '../src/SlackClient';
jest.mock("@slack/client");

describe("post", () => {
  it("normal condition", async() => {
    const client = new SlackClient();
    //await client.post(text, attachments);
    expect(WebClient.mocked.chat.post).toBeCalledWith();
  });
});
