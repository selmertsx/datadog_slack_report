/** @jsx JSXSlack.h */
import { MessageAttachment } from "@slack/client";
import JSXSlack, { Block, Section } from "@speee-js/jsx-slack";
import moment from "moment-timezone";

// TODO: SlackMessage classは削除してもいいかも知れないな。
export function slackMessageBlock(fromTime: string, toTime: string, attachments: MessageAttachment[]) {
  const messages = [];
  for (const attachment of attachments) {
    const message = (
      <blockquote>
        <b> {attachment.title} </b>
        <br />
        {attachment.text}
      </blockquote>
    );
    messages.push(message);
  }

  return JSXSlack(
    <Block>
      <Section>
        <p>datadog monitoring daily report</p>
        <br />
        {moment.unix(parseInt(fromTime, 10)).toString()} ~ {moment.unix(parseInt(toTime, 10)).toString()}
        {messages}
      </Section>
    </Block>
  );
}
