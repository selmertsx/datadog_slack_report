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
    const productMetricsList = products.map(product => product.metrics);
    const metricMap = new Map();
    for (const metrics of productMetricsList) {
      for (const unixTime of metrics.keys()) {
        const count = metricMap.get(unixTime);
        const setCount = count ? metrics.get(unixTime) + count : metrics.get(unixTime);
        metricMap.set(unixTime, setCount);
      }
    }

    return Array.from(metricMap.entries())
      .filter(arr => arr[1] > desiredHostCount)
      .map(arr => arr[0]);
  }

  public overProduct(unixTime: number) {
    const result = new Map();
    return result;
  }
}
