/** @jsx JSXSlack.h */
import JSXSlack, { Block, Section } from "@speee-js/jsx-slack";
import moment from "moment-timezone";

export function slackMessageBlock(fromTime: string, toTime: string) {
  return JSXSlack(
    <Block>
      <Section>
        <p>datadog monitoring daily report</p>
        <br />
        {moment.unix(parseInt(fromTime, 10)).toString()} ~ {moment.unix(parseInt(toTime, 10)).toString()}
        <blockquote>
          <b>product:xxx</b>
          <br />
          <i>Build JSON for Slack Block Kit from JSX</i>
        </blockquote>
      </Section>
    </Block>
  );
}
