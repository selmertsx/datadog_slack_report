import { MessageAttachment, WebAPICallResult, WebClient } from "@slack/client";
import { slackMessageBlock } from "./SlackMessageBlock";

export class SlackClient {
  private static username: string = "Datadog按分計算Bot";
  private readonly channelID: string = process.env.CHANNEL_ID as string;
  private readonly token: string = process.env.SlackToken as string;
  private readonly client: WebClient;

  constructor() {
    this.client = new WebClient(this.token);
  }

  public post(fromTime: string, toTime: string, attachments: MessageAttachment[]) {
    return this.client.chat.postMessage({
      channel: this.channelID,
      text: "",
      blocks: slackMessageBlock(fromTime, toTime, attachments),
      username: SlackClient.username,
    });
  }
}
