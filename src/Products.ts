import { DatadogHostMetrics, PointList, ReservedPlan } from "./datadog";
import { Product } from "./Product";

export class Products {
  public static create(plans: ReservedPlan[], hostMetrics: DatadogHostMetrics[]): Products {
    const result = new Products();
    for (const plan of plans) {
      const productMetrics = hostMetrics.filter(metrics => metrics.product === plan.productName);
      const pointlists = productMetrics !== [] ? productMetrics[0].pointlists : [];
      const product = new Product(plan.productName, plan.plannedHostCount, pointlists);
      result.list.set(plan.productName, product);
    }
    return result;
  }

  public list: Map<string, Product> = new Map();

  public overPeriod() {
    const products: Product[] = Array.from(this.list.values());
    const totalDesiredHostCount = products.map(product => product.desiredHostCount).reduce((sum, num) => sum + num);
    const metrics = products.map(product => product.metrics).reduce((acc, e) => acc.concat(e));
    const metricMap = new Map();
    for (const metric of metrics) {
      const count = metricMap.get(metric.unixTime);
      const setCount = count ? metric.count + count : metric.count;
      metricMap.set(metric.unixTime, setCount);
    }
    
    return ;
  }
}
