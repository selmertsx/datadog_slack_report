import { Firestore } from "@google-cloud/firestore";

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class ReservedPlan {
  // 完全に動作確認のためのコード
  public async getHostCount() {
    const firestore = new Firestore();
    const doc = firestore.doc("datadog/plan");
    return await doc.get();
  }

  public async postHostCount(productName: string, hostNumber: number) {
    const firestore = new Firestore();
    const doc = firestore.doc("datadog/plan");
    return doc.create({
      product_name: productName,
      host_number: hostNumber,
    });
  }
}

const plan = new ReservedPlan();

plan
  .getHostCount()
  .then(console.log)
  .catch(console.error);
