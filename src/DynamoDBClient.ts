import { DynamoDB } from "aws-sdk";
import { DatadogMonitoringPlan } from "./typings/datadog";

export class DynamoDBClient {
  private client = new DynamoDB.DocumentClient({
    region: "ap-northeast-1",
  });

  public fetchMonitoringPlans(): Promise<DatadogMonitoringPlan[]> {
    return new Promise<any>((resolve: any, rejects: any) => {
      this.client.scan({ TableName: "DatadogPlan" }, (error, data) => {
        if (error) {
          rejects(error);
        } else if (data.Items == undefined) {
          resolve([]);
        } else {
          const results: DatadogMonitoringPlan[] = [];
          data.Items.forEach(item => {
            results.push({ productName: item.Product, plannedInfraHosts: item.PlannedHostCount });
          });
          resolve(results);
        }
      });
    });
  }
}
