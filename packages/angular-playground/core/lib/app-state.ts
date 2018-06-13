export interface SelectedSandboxAndScenarioKeys {
    sandboxKey: string;
    scenarioKey: number;
}
export interface Sandbox {
    key: string;
    type: any;
    imports?: any[];
    declarations?: any[];
    entryComponents?: any[];
    scenarios: Scenario[];
    providers?: any[];
    schemas?: any[];
    declareComponent?: boolean;
}

export interface Scenario {
    key: number;
    template: string;
    styles?: string[];
    context?: any;
    providers?: any[];
}

export interface SandboxMenuItem {
    key: string;
    searchKey: string;
    name: string;
    label?: string;
    scenarioMenuItems: ScenarioMenuItem[];
}

export interface ScenarioMenuItem {
    key: number;
    description: string;
}
