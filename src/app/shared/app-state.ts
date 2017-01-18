export interface SelectedSandboxAndScenarioKeys {
  sandboxKey: string;
  scenarioKey: string;
}

export interface Sandbox {
  key: string;
  name: string;
  type: any,
  modules?: any[],
  declarations?: any[],
  scenarios: Scenario[]
}

export interface Scenario {
  key: string;
  description: string,
  template: string,
  styles?: string[],
  context?: any,
  providers?: any[]
}
