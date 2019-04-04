import { DatadogHostMetrics, ProductReport, ReservedPlan } from "./datadog";
import { Product } from "./Product";

export class Products {
  get productList(): Product[] {
    return Array.from(this.list.values());
  }

  public static create(plans: ReservedPlan[], hostMetrics: DatadogHostMetrics[]): Products {
    const result = new Products();
    for (const plan of plans) {
      const productMetrics = hostMetrics.find(metrics => metrics.product === plan.productName);
      if (productMetrics) {
        const product = new Product(plan.productName, plan.plannedHostCount, productMetrics.pointlists);
        result.list.set(plan.productName, product);
      }
    }
    return result;
  }

  public list: Map<string, Product> = new Map();

  /**
   *
   * @returns {Map<unixTime, ProductHostMap>} - The keys are unix times which exceeds the planned number of monitoring hosts.
   */
  public overPlanProducts(): ProductReport[] {
    const result: ProductReport[] = [];
    const periods = this.overPeriod();

    for (const product of this.productList) {
      const exceedHostCount = periods.map(period => product.overCount(period)).reduce((acc, cur) => acc + cur);
      if (exceedHostCount > 0) {
        result.push({
          exceedHostCount,
          name: product.name,
          plannedHost: product.desiredHostCount,
        });
      }
    }

    return result;
  }

  /**
   * @return {number[]} unix time list that sum of the monitored host counts was larger than the applied plan.
   */
  private overPeriod(): number[] {
    const desiredHostCount = this.productList.map(product => product.desiredHostCount).reduce((sum, num) => sum + num);
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
