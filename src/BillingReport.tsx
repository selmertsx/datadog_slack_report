/** @jsx JSXSlack.h */
import JSXSlack, { Block, Divider, Field, Section } from "@speee-js/jsx-slack";

import moment from "moment-timezone";
import { ProductReport } from "./datadog";

export class BillingReport {
  constructor(
    private fromTime: string,
    private toTime: string,
    private overPeriods: number[],
    private productReports: ProductReport[]
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
    const productDetails = [];
    for(const report of this.productReports){
      const message = (
        <Field>
        <b> {report.name} </b>
        <br />
        予定監視ホスト数: {report.plannedHost} <br />
        超過分(超過ホスト数×超過時間): {report.exceedHostCount} <br />
        追加請求分(単位$): { report.exceedHostCount * 0.03  } <br />
      </Field>
      )
      productDetails.push(message);
    }

    return JSXSlack(
      <Block>
        <Section>
          <b>Datadog監視レポート</b> <br />
          {this.monitoredTime()} <br />
          {this.exceedHours()}時間分、予定以上に取得されています <br />
          内訳は下記の通りです。
        </Section>
        <Divider />
        <Section> {productDetails} </Section>
      </Block>
    )
  }
}
