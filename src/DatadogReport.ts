import { DatadogClient } from "./DatadogClient";
import { InfraReports } from "./InfraReports";
import { InfraReportsMessage } from "./InfraReportsMessage";
import { DatadogMonitoringPlan } from "./typings/datadog";

/**
 *
 * @param fromTime
 * @param toTime
 */

export async function fetchDatadogMetrics(fromTime: string, toTime: string, monitoringPlans: DatadogMonitoringPlan[]) {
  const datadogClient = new DatadogClient();
  const infraHosts = await datadogClient.fetchInfraHosts(fromTime, toTime);
  // const apmHosts = await datadogClient.fetchAPMHosts(fromTime, toTime);
  const infraReports = InfraReports.create(monitoringPlans, infraHosts);
  const infraReportsMessage = new InfraReportsMessage(fromTime, toTime, infraReports);
  // const apmReports = APMReports.create(monitoringPlans, apmHosts);
  // const apmReportsMessage = new APMreportsMessage(fromTime, toTime, apmReports);
  return infraReportsMessage;
}
