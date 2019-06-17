import { DatadogClient } from "./DatadogClient";
import { DatadogMonitoringPlan } from "./typings/datadog";

export async function fetch(fromTime: string, toTime: string, monitoringPlans: DatadogMonitoringPlan[]) {
  const datadogClient = new DatadogClient();
  // const apmHosts = await datadogClient.fetchAPMHosts(fromTime, toTime);
  // const apmReports = APMReports.create(monitoringPlans, apmHosts);
  // const apmReportsMessage = new APMreportsMessage(fromTime, toTime, apmReports);
  return [];
}
