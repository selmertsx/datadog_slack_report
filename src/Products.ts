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

  public list: Map<string, Product> = new Map();

  // TODO: Refactoring
  public overPeriod() {
    const products: Product[] = Array.from(this.list.values());
    const desiredHostCount = products.map(product => product.desiredHostCount).reduce((sum, num) => sum + num);
    const metricMap = new Map();
    for (const product of products) {
      for (const unixTime of product.metrics.keys()) {
        const count = metricMap.get(unixTime);
        const setCount = count ? product.metrics.get(unixTime) + count : product.metrics.get(unixTime);
        metricMap.set(unixTime, setCount);
      }
    }

    return Array.from(metricMap.entries())
      .filter(arr => arr[1] > desiredHostCount)
      .map(arr => arr[0]);
  }

  public overProduct(unixTime: number) {
    const result = new Map();
    const products: Product[] = Array.from(this.list.values());
    for (const product of products) {
      const overCount = product.overCount(unixTime);
      if (overCount > 0) {
        result.set(product.name, overCount);
      }
    }
    return result;
  }
}
