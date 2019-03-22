import { Firestore } from "@google-cloud/firestore";

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class FirestoreClient {
  // 完全に動作確認のためのコード
  public async getHostCount() {
    const firestore = new Firestore();
    const docs = await firestore.collection("datadog").get();
    docs.forEach(doc => {});
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

const client = new FirestoreClient();

client
  .getHostCount()
  .then(console.log)
  .catch(console.error);
