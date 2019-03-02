import { WebClient } from "@slack/client";

export class SlackClient {
  private static username: string = "Datadog按分計算Bot";
  private readonly channelID: string = process.env.CHANNEL_ID as string;
  private readonly token: string = process.env.SlackToken as string;
  private readonly client: WebClient;

  constructor() {
    this.client = new WebClient(this.token);
  }

  public post(blocks: any) {
    return this.client.chat.postMessage({
      channel: this.channelID,
      text: "",
      blocks,
      username: SlackClient.username,
    });
  }
}
