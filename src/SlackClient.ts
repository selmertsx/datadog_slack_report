import { MessageAttachment, WebAPICallResult, WebClient } from "@slack/client";

export class SlackClient {
  private readonly channelID: string = process.env.ChannelID as string;
  private readonly token: string = process.env.SlackToken as string;
  private readonly client: WebClient;

  constructor() {
    this.client = new WebClient(this.token);
  }

  public post(attachments: MessageAttachment[]): Promise<WebAPICallResult> {
    return this.client.chat.postMessage({
      attachments,
      channel: this.channelID,
      text: "",
      username: "Datadog按分計算Bot",
    });
  }
}
