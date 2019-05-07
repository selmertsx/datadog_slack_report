/** @jsx JSXSlack.h */
import JSXSlack, { Block, Divider, Field, Section } from "@speee-js/jsx-slack";

import moment from "moment-timezone";
import { ProductReport } from "./typings/products";
import { InfraReports } from './InfraReports';

export class InfraReportsMessage {
  private readonly fromTime: string;
  private readonly toTime: string;
  private readonly overPeriods: number[];
  private readonly productReports: ProductReport[];

  constructor(fromTime: string, toTime: string, infraReports: InfraReports) {
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.overPeriods = infraReports.exceededPeriods();
    this.productReports = infraReports.exceededProducts();
  }

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

  private details(){
    const result = [];

    for(const report of this.productReports){
      const message = (
        <Field>
        <b> {report.productName} </b>
        <br />
        予定監視ホスト数: {report.plannedHost} <br />
        超過分(超過ホスト数×超過時間): {report.exceedHostCount} <br />
        追加請求分(単位$): { report.exceedHostCount * 0.03  } <br />
      </Field>
      )
      result.push(message);
    }

    return ( result.length === 0 ) ? [] : (<Section>{result}</Section>)
  }

  private outline(){
    const exceedHours = this.exceedHours();
    return (exceedHours === 0) ? (
      <Section>
        <b>Datadog監視レポート</b> <br />
        {this.monitoredTime()} <br />
        上記の期間において予定を超過した数のホストは監視されませんでした
      </Section>
    ):(
      <Section>
        <b>Datadog監視レポート</b> <br />
        {this.monitoredTime()} <br />
        {exceedHours}時間分、予定した数のホストを超過して監視しました <br/>
        内訳は下記のようになります。
      </Section>
    )
  }

  public body() {
    return JSXSlack(
      <Block>
        { this.outline() }
        <Divider />
        { this.details() }
      </Block>
    )
  }
}
