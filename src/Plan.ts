import { Firestore } from "@google-cloud/firestore";

/**
 * 監視したいプロダクト、ホスト数を保存するDataStore
 * 雑にPlanという名前にした。もう少し解像度が上がったら、そのときに適切な名前をつける
 * Datastoreを使おうと思ったら、この記事にFireStoreの方が新しいよってことが書いてあった。
 * https://cloud.google.com/datastore/docs/firestore-or-datastore?hl=ja
 */
export class Plan {
  // 完全に動作確認のためのコード
  public async getHostCount() {
    const firestore = new Firestore();
    const document = firestore.doc("posts/intro-to-firestore");
    await document.set({
      title: "Welcome to Firestore",
      body: "Hello world",
    });

    await document.update({
      body: "My first Firestore app",
    });

    const doc = await document.get();
    console.log(doc);
  }
}

const plan = new Plan();

plan
  .getHostCount()
  .then(console.log)
  .catch(console.error);
