import { Firestore, WriteResult } from "@google-cloud/firestore";
import { ReservedPlan } from "./ReservedPlan";

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class FirestoreClient {
  public async getReservedPlans(): Promise<ReservedPlan[]> {
    const firestore = new Firestore();
    const docs = await firestore.collection("datadog").get();
    const results: ReservedPlan[] = [];
    docs.forEach(doc => {
      const data = doc.data();
      results.push(new ReservedPlan(data.name, data.host_number));
    });
    return results;
  }

  public async postReservedPlan(plan: ReservedPlan): Promise<WriteResult> {
    const firestore = new Firestore();
    const doc = firestore.collection("datadog").doc(plan.name);
    return doc.create({ name: plan.name, host_number: plan.hostNumber });
  }

  public async updateReservedPlan(plan: ReservedPlan): Promise<WriteResult> {
    const firestore = new Firestore();
    const doc = firestore.collection("datadog").doc(plan.name);
    return doc.set({ host_number: plan.hostNumber });
  }
}

const client = new FirestoreClient();
