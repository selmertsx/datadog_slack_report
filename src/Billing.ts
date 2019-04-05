import { BillingReport } from "./BillingReport";
import { DatadogClient } from "./DatadogClient";
import { FirestoreClient } from "./FirestoreClient";
import { Products } from "./Products";

export class Billing {
  /**
   * @param fromTime
   * @param toTime
   *
   * @todo https://docs.datadoghq.com/ja/api/?lang=console#metrics-query より、fromTimeとtoTimeの間は24時間未満でなければならない。inputとして24時間以上のデータが入ってきたら、エラーを出す仕組みを作る。
   */

  public async calculate(fromTime: string, toTime: string): Promise<BillingReport> {
    const datadogClient = new DatadogClient();
    const datadogHostMetrics = await datadogClient.countHosts(fromTime, toTime);
    const fireStoreClient = new FirestoreClient();
    const reservedPlans = await fireStoreClient.getReservedPlans();
    const products = Products.create(reservedPlans, datadogHostMetrics);
    const productReport = products.overPlanProducts();
    const overPeriods = products.overPeriod();
    return new BillingReport(fromTime, toTime, overPeriods, productReport);
  }
}
