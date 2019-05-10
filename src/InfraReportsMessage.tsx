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
    const fromTime = moment.unix(parseInt(this.fromTime, 10)).format("LLL").toString();
    const toTime = moment.unix(parseInt(this.toTime, 10)).format("LLL").toString();

    return `${fromTime} ~ ${toTime}`;
  }

  private details(){
    const result = [];

    for(const report of this.productReports){
      const message = (
        <Field>
        <b> {report.productName} </b>
        <br />
        超過分: {report.exceedHostCount} <br />
        追加請求分(単位$): { report.exceedHostCount * 0.03  } <br />
      </Field>
      )
      result.push(message);
    }

    return ( result.length === 0 ) ? [] : (<Section>{result}</Section>)
  }

  private header(){
    return (
      <Section>
        <b>Datadog監視レポート</b> <br />
        {this.monitoredTime()} <br />
      </Section>
    );
  }

  public body() {
    return JSXSlack(
      <Block>
        { this.header() }
        <Divider />
        { this.details() }
      </Block>
    )
  }
}
