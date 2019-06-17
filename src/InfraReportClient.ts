import { DatadogClient } from "./DatadogClient";
import { InfraReports } from "./InfraReports";
import { InfraReportsMessage } from "./InfraReportsMessage";
import { DatadogMonitoringPlan } from "./typings/datadog";

/**
 *
 * @param fromTime
 * @param toTime
 */

export async function fetch(fromTime: string, toTime: string, monitoringPlans: DatadogMonitoringPlan[]) {
  const datadogClient = new DatadogClient();
  const infraHosts = await datadogClient.fetchInfraHosts(fromTime, toTime);
  const infraReports = InfraReports.create(monitoringPlans, infraHosts, fromTime, toTime);
  const infraReportsMessage = new InfraReportsMessage(infraReports);
  return infraReportsMessage;
}
