// @todo rename
export interface DatadogMetricsFactoryInput {
  maxInfraHosts: number;
  minInfraHosts: number;
  name: string;
  plannedInfraHosts: number;
}

// @todo 期間を渡せば、1時間単位のpointListsを自動で作るようにしたい
export function create(firstTime: string, lastTime: string, data: any) {}
