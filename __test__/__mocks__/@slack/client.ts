import { MessageAttachment } from '@slack/client';
import { SlackClient } from '../../../src/SlackClient';

export class WebClient {
  public static mocked = {
    channel: "channelID",
    chat: {
      post: jest.fn(),
    }
  };

  public chat() {
    return {
      postMessage: (text: string, attachments: MessageAttachment[]) => {
        return {
          attachments,
          channel: WebClient.mocked.channel,
          text,
          username: SlackClient.username
        }
      }
    }
  }
}
