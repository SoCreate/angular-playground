export interface SelectedSandboxAndScenarioKeys {
  sandboxKey: string;
  scenarioKey: number;
}

export interface Sandbox {
  key: string;
  name: string;
  type: any,
  prependText?: string,
  imports?: any[],
  declarations?: any[],
  scenarios: Scenario[],
  providers?: any[],
  declareComponent?: boolean,
}

export interface Scenario {
  key: number;
  description: string,
  template: string,
  styles?: string[],
  context?: any,
  providers?: any[]
}
