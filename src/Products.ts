import { DatadogHostMetrics, ReservedPlan } from "./datadog";
import { Product } from "./Product";

export class Products {
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

  get productList(): Product[] {
    return Array.from(this.list.values());
  }

  public list: Map<string, Product> = new Map();

  /**
   * @return {number[]} unix time list that sum of the monitored host counts was larger than the applied plan.
   */
  public overPeriod(): number[] {
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
  /**
   * Return Product Map object that exceeded their plan in given time
   *
   * @param {number} unixTime - params to get products that exceeded the applied plan. e.g. 1554105212 (2019/04/01 16:53:32)
   * @return {Map<string, number>} - string is product name. number is `measuredHostCount - plannedHostCount` e.g. Map<"sampleProductA", 20>
   */
  public overProduct(unixTime: number): Map<string, number> {
    const result = new Map<string, number>();
    for (const product of this.productList) {
      const overCount = product.overCount(unixTime);
      if (overCount > 0) {
        result.set(product.name, overCount);
      }
    }
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
