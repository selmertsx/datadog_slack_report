import { BillingReport } from "./BillingReport";
import { DatadogHostMetrics, DatadogMonitoringPlan } from "./typings/datadog";
import { ProductReport } from "./typings/products";

export class BillingReports {
  get productList(): BillingReport[] {
    return Array.from(this.list.values());
  }

  public static create(plans: DatadogMonitoringPlan[], hostMetrics: DatadogHostMetrics[]): BillingReports {
    const result = new BillingReports();

    for (const plan of plans) {
      const productMetrics = hostMetrics.find(metrics => metrics.product === plan.productName);
      if (productMetrics) {
        const product = new BillingReport(plan.productName, plan.plannedInfraHosts, productMetrics.pointlists);
        result.list.set(plan.productName, product);
      }
    }

    return result;
  }

  public list: Map<string, BillingReport> = new Map();

  public overPlanProducts(): ProductReport[] {
    const result: ProductReport[] = [];
    const periods = this.overPeriod();

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
  public overPeriod(): number[] {
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
      for (const unixTime of product.unixTimes()) {
        const count = result.get(unixTime);
        const setCount = count ? product.metrics.get(unixTime) + count : product.metrics.get(unixTime);
        result.set(unixTime, setCount);
      }
    }
    return result;
  }
}
