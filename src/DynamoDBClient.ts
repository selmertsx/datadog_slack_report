import { DynamoDB } from "aws-sdk";
import { ReservedPlan } from "./datadog";

export class DynamoDBClient {
  private client = new DynamoDB.DocumentClient({
    endpoint: "http://localhost:8000",
    region: "ap-north-east1",
  });

  public getReservedPlans(): Promise<ReservedPlan[]> {
    return new Promise<any>((resolve: any, rejects: any) => {
      this.client.scan({ TableName: "DatadogPlan" }, (error, data) => {
        if (error) {
          rejects(error);
        } else if (data.Items == undefined) {
          resolve([]);
        } else {
          const results: ReservedPlan[] = [];
          data.Items.forEach(item => {
            results.push({ productName: item.Product, plannedHostCount: item.PlannedHostCount });
          });

          resolve(results);
        }
      });
    });
  }
}
