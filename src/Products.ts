import { DatadogHostMetrics, ReservedPlan } from "./datadog";
import { Product } from "./Product";

export class Products {
  public static create(plans: ReservedPlan[], hostMetrics: DatadogHostMetrics[]): Products {
    const result = new Products();
    for (const plan of plans) {
      const pointlists = hostMetrics.filter(metric => metric.product === plan.productName)[0].pointlists;
      const product = new Product(plan.productName, plan.plannedHostCount, pointlists);
      result.list.set(plan.productName, product);
    }
    return result;
  }

  public list: Map<string, Product> = new Map();
}
