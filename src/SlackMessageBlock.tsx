import JSXSlack, { Block, Section } from "@speee-js/jsx-slack";

export function slackMessageBlock() {
  return JSXSlack(
    <Block>
      <Section>
        Enjoy building blocks!
        <blockquote>
          <b>product:xxx</b>
          <br />
          <i>Build JSON for Slack Block Kit from JSX</i>
        </blockquote>
      </Section>
    </Block>
  );
}
