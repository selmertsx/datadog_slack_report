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

  // TODO: Refactoring
  public overPeriod() {
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

  public overProduct(unixTime: number) {
    const result = new Map();
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
