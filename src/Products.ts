import { DatadogHostMetrics } from "./datadog";
import { Product } from "./Product";
import { ReservedPlan } from "./ReservedPlan";

export class Products {
  public static create(plans: ReservedPlan[], hostMetrics: DatadogHostMetrics[]): Products {
    const result = new Products();
    for (const plan of plans) {
      const pointlists = hostMetrics.filter(metric => metric.product === plan.name)[0].pointlists;
      const product = new Product(plan.name, plan.hostNumber, pointlists);
      result.list.set(plan.name, product);
    }
    return result;
  }

  public list: Map<string, Product> = new Map();
}
