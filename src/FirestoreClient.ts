import { Firestore, WriteResult } from "@google-cloud/firestore";
import { ReservedPlan } from "./datadog";

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class FirestoreClient {
  private firestore: Firestore;
  constructor() {
    this.firestore = new Firestore();
  }

  public async getReservedPlans(): Promise<ReservedPlan[]> {
    const docs = await this.firestore.collection("datadog").get();
    const results: ReservedPlan[] = [];
    docs.forEach(doc => {
      const data = doc.data();
      results.push({ productName: data.name, plannedHostCount: data.host_number });
    });
    return results;
  }

  public async postReservedPlan(productName: string, plannedHostCount: number): Promise<WriteResult> {
    const doc = this.firestore.collection("datadog").doc(productName);
    return doc.create({ name: productName, host_number: plannedHostCount });
  }

  public async updateReservedPlan(productName: string, plannedHostCount: number): Promise<WriteResult> {
    const doc = this.firestore.collection("datadog").doc(productName);
    return doc.set({ host_number: plannedHostCount });
  }

  public async deleteReservedPlan(planName: string) {
    const doc = this.firestore.collection("datadog").doc(planName);
    return doc.delete();
  }
}
