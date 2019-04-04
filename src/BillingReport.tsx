/** @jsx JSXSlack.h */
import JSXSlack, { Block, Divider, Field, Section } from "@speee-js/jsx-slack";

import moment from "moment-timezone";
import { ProductReport } from "./datadog";

export class BillingReport {
  constructor(
    private fromTime: string,
    private toTime: string,
    private overPeriods: number[],
    private productReport: ProductReport[]
  ) {}

  private monitoredTime(): string {
    const fromTime = moment
      .unix(parseInt(this.fromTime, 10))
      .format("LLL")
      .toString();
    const toTime = moment
      .unix(parseInt(this.toTime, 10))
      .format("LLL")
      .toString();

    return `${fromTime} ~ ${toTime}`;
  }

  private exceedHours() {
    return this.overPeriods.length;
  }

  public slackMessageDetail() {
    return JSXSlack(
      <Block>
        <Section>
          <b>datadog monitoring daily report</b> <br />
          {this.monitoredTime()} <br />
        </Section>
      </Block>
    )
  }
}
