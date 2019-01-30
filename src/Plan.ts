import { Datastore } from "@google-cloud/datastore";
const projectId = process.env.PROJECT_ID;

/**
 * 監視したいプロダクト、ホスト数を保存するDatastoreにアクセスする
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 */
export class Plan {
  // 完全に動作確認のためのコード
  public async getHostCount() {
    const datastore = new Datastore({ projectId });
    const kind = "Task";
    const name = "sampletask1";
    const taskKey = datastore.key([kind, name]);
    const task = {
      key: taskKey,
      data: {
        description: "Buy Milk",
      },
    };

    await datastore.save(task);
  }
}

const plan = new Plan();

plan
  .getHostCount()
  .then(console.log)
  .catch(console.error);
