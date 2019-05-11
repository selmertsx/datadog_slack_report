import { InfraReport } from "./InfraReport";
import { DatadogHostMetrics, DatadogMonitoringPlan } from "./typings/datadog";
import { ProductReport } from "./typings/products";

export class InfraReports {
  get productList(): InfraReport[] {
    return Array.from(this.list.values());
  }

  public static create(plans: DatadogMonitoringPlan[], hostMetrics: DatadogHostMetrics[]): InfraReports {
    const result = new InfraReports();

    for (const plan of plans) {
      const productMetrics = hostMetrics.find(metrics => metrics.product === plan.productName);
      if (productMetrics) {
        const product = new InfraReport(plan.productName, plan.plannedInfraHosts, productMetrics.pointlists);
        result.list.set(plan.productName, product);
      }
    }

    return result;
  }

  public list: Map<string, InfraReport> = new Map();

  public exceededProducts(): ProductReport[] {
    const result: ProductReport[] = [];
    const periods = this.exceededPeriods();

    for (const product of this.productList) {
      const exceedHostCount = periods.map(period => product.overCount(period)).reduce((acc, cur) => acc + cur, 0);
      if (exceedHostCount > 0) {
        result.push({
          exceedHostCount,
          productName: product.productName,
          plannedHost: product.desiredHostCount,
        });
      }
    }

    return result;
  }

  /**
   * @return {number[]} unix time list that sum of the monitored host counts was larger than the applied plan.
   */
  private exceededPeriods(): number[] {
    const desiredHostCount = this.productList
      .map(product => product.desiredHostCount)
      .reduce((sum, num) => sum + num, 0);
    const metricsMap = this.sumMetricsForEachPeriod();
    const result: number[] = [];
    metricsMap.forEach((totalHostCount, unixTime) => {
      if (totalHostCount > desiredHostCount) {
        result.push(unixTime);
      }
    });

    return result;
  }

  private sumMetricsForEachPeriod(): Map<number, number> {
    const result = new Map();
    for (const product of this.productList) {
      for (const unixTime of product.unixTimes) {
        const count = result.get(unixTime);
        const setCount = count ? product.getHostCount(unixTime) + count : product.getHostCount(unixTime);
        result.set(unixTime, setCount);
      }
    }
    return result;
  }
}
