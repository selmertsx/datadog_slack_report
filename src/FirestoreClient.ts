import * as admin from "firebase-admin";
admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

import { ReservedPlan } from "./datadog";

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class FirestoreClient {
  public async getReservedPlans(): Promise<ReservedPlan[]> {
    const docs = await firestore.collection("datadog").get();
    const results: ReservedPlan[] = [];
    docs.forEach(doc => {
      const data = doc.data();
      results.push({ productName: data.name, plannedHostCount: data.host_number });
    });
    return results;
  }
}
