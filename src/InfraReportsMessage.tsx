/** @jsx JSXSlack.h */
import JSXSlack, { Block, Divider, Field, Section } from "@speee-js/jsx-slack";

import { InfraReport } from "./InfraReport";
import { InfraReports } from "./InfraReports";
import { ProductReport } from "./typings/products";

export class InfraReportsMessage {
  private readonly fromTime: string;
  private readonly toTime: string;
  private readonly exceedProductReports: ProductReport[];
  private readonly productReports: InfraReport[];

  constructor(infraReports: InfraReports) {
    this.fromTime = infraReports.fromTime;
    this.toTime = infraReports.toTime;
    this.exceedProductReports = infraReports.exceededProducts();
    this.productReports = infraReports.productList;
  }

  public body() {
    return JSXSlack(
      <Block>
        {this.header()}

        <Divider />
        <Section>
          <b>[Infra] 監視内容</b> <br />
          プロダクト名 (実監視台数 / 予定監視台数) <br />
          {this.monitoredDetail()}
        </Section>

        <Divider />
        <Section>
          [<b>Infra] 超過分 </b> <br />
          {this.exceededDetail()}
        </Section>
      </Block>
    );
  }

  private monitoredTime(): string {
    return `${this.fromTime} ~ ${this.toTime}`;
  }

  private exceededDetail() {
    const result = [];

    for (const report of this.exceedProductReports) {
      const message = (
        <Field>
          <b> {report.productName} </b> <br />
          超過分: {report.exceedHostCount} <br />
          追加請求分(単位$): {report.exceedHostCount * 0.03} <br />
        </Field>
      );
      result.push(message);
    }

    return result.length === 0 ? [] : result;
  }

  private monitoredDetail() {
    const result = [];

    for (const product of this.productReports) {
      const count =
        product.minCount() === product.maxCount()
          ? `${product.minCount()}/${product.desiredHostCount}`
          : `${product.minCount()}~${product.maxCount()}/${product.desiredHostCount}`;

      const message = (
        <Field>
          {product.productName} ({count})
        </Field>
      );
      result.push(message);
    }

    return result;
  }

  private header() {
    return (
      <Section>
        <b>Datadog Monitoringレポート</b> <br />
        {this.monitoredTime()} <br />
      </Section>
    );
  }
}
