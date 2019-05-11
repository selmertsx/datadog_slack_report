/** @jsx JSXSlack.h */
import JSXSlack, { Block, Divider, Field, Section } from "@speee-js/jsx-slack";

import moment from "moment-timezone";
import { ProductReport } from "./typings/products";
import { InfraReports } from './InfraReports';
import { InfraReport } from './InfraReport';

export class InfraReportsMessage {
  private readonly fromTime: string;
  private readonly toTime: string;
  private readonly exceedProductReports: ProductReport[];
  private readonly productReports: InfraReport[];

  constructor(fromTime: string, toTime: string, infraReports: InfraReports) {
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.exceedProductReports = infraReports.exceededProducts();
    this.productReports = infraReports.productList;
  }

  private monitoredTime(): string {
    const fromTime = moment.unix(parseInt(this.fromTime, 10)).format("LLL").toString();
    const toTime = moment.unix(parseInt(this.toTime, 10)).format("LLL").toString();

    return `${fromTime} ~ ${toTime}`;
  }

  private exceededDetail(){
    const result = [];

    for(const report of this.exceedProductReports){
      const message = (
        <Field>
          <b> {report.productName} </b> <br />
          超過分: {report.exceedHostCount} <br />
          追加請求分(単位$): { report.exceedHostCount * 0.03  } <br />
        </Field>
      )
      result.push(message);
    }

    return ( result.length === 0 ) ? [] : result;
  }

  private monitoredDetail(){
    const result = [];

    for (const product of this.productReports) {
      const count = product.minCount() === product.maxCount() ?
        `${product.minCount()}/${product.desiredHostCount}` :
        `${product.minCount()}~${product.maxCount()}/${product.desiredHostCount}`;

      const message = <Field> {product.productName} ({count})</Field>
      result.push(message);
    }

    return result;
  }

  private header(){
    return (
      <Section>
        <b>Datadog Monitoring レポート</b> <br />
        {this.monitoredTime()} <br />
      </Section>
    );
  }

  public body() {
    return JSXSlack(
      <Block>
        { this.header() }

        <Divider />
        <Section>
          <b>[Infra] 監視内容</b> <br />
          プロダクト名 (実監視台数 / 予定監視台数) <br />
          { this.monitoredDetail()}
        </Section>

        <Divider />
        <Section>
          [<b>Infra] 超過分 </b><br />
          { this.exceededDetail() }
        </Section>
      </Block>
    )
  }
}
