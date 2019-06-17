import { DatadogClient } from "./DatadogClient";
import { DynamoDBClient } from "./DynamoDBClient";
import { InfraReports } from "./InfraReports";
import { InfraReportsMessage } from "./InfraReportsMessage";

export async function fetchDatadogMetrics(fromTime: string, toTime: string) {
  const datadogClient = new DatadogClient();
  const infraHosts = await datadogClient.fetchInfraHosts(fromTime, toTime);
  // const apmHosts = await datadogClient.fetchAPMHosts(fromTime, toTime);

  const dynamoDBClient = new DynamoDBClient();
  const monitoringPlans = await dynamoDBClient.fetchMonitoringPlans();

  const infraReports = InfraReports.create(monitoringPlans, infraHosts);
  const infraReportsMessage = new InfraReportsMessage(fromTime, toTime, infraReports);

  // const apmReports = APMReports.create(monitoringPlans, apmHosts);
  // const apmReportsMessage = new APMreportsMessage(fromTime, toTime, apmReports);
  return infraReportsMessage;
}
