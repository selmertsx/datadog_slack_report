import { BillingReport } from "./BillingReport";
import { DatadogClient } from "./DatadogClient";
import { FirestoreClient } from "./FirestoreClient";
import { Products } from "./Products";

export class Billing {
  /**
   * DatadogからfromTime, toTimeの期間内でデータを引っ張ってくる
   * DataStoreからfromTime, toTimeの期間内での監視計画を取ってくる
   * Datadogで計測したホスト数 <= DataStoreから取得した計測予定のホスト数の場合、計画した請求金額をslackに通知する。
   * Datadogで計測したホスト数 > DataStoreから取得した計測予定のホスト数の場合、追加請求分を計算する。
   * 請求金額の計算ロジックは DatadogBillingRulesとかそういうクラスを作ってやらせる。
   * responseはBillingReportの配列であり、それらBillingReportの配列には下記の要素が含まれている
   * BillingReport Object { name: "プロダクト名", plan: "予定していた監視ホスト数とその金額", additional: "予定していた分を超過した場合の追加徴収金額とその内訳を記載する" }
   *
   * @param fromTime
   * @param toTime
   */

  public async calculate(fromTime: string, toTime: string): Promise<BillingReport[]> {
    const fireStoreClient = new FirestoreClient();
    const reservedPlans = await fireStoreClient.getReservedPlans();
    const datadogClient = new DatadogClient();
    const datadogHostMetrics = await datadogClient.countHosts(fromTime, toTime);
    const products = Products.create(reservedPlans, datadogHostMetrics);
    console.log(products);
    return [new BillingReport("sample")];
  }
}
