const projectId = process.env.PROJECT_ID;

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class ReservedPlan {
  // 完全に動作確認のためのコード
  public async getHostCount() {}

  public async postHostCount(productName: string, hostNumber: number) {}
}

const plan = new ReservedPlan();

plan
  .getHostCount()
  .then(console.log)
  .catch(console.error);
