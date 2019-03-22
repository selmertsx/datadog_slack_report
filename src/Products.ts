import { DatadogHostMetrics } from "./datadog";
import { Product } from "./Product";
import { ReservedPlan } from "./ReservedPlan";

export class Products {
  public static create(plans: ReservedPlan[], hostMetrics: DatadogHostMetrics[]): Products {
    const result = new Products();
    for (const plan of plans) {
      const product = new Product();
      result.list.set(plan.name, product);
    }
    return result;
  }

  private list: Map<string, Product> = new Map();
}
