import { SelectedSandboxAndScenarioKeys } from './app-state';
export declare class StateService {
    filter: any;
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
    constructor();
    getFilter(): any;
    setFilter(value: any): void;
    getSelectedSandboxAndScenarioKeys(): SelectedSandboxAndScenarioKeys;
    setSandboxAndScenarioKeys(value: SelectedSandboxAndScenarioKeys): void;
    saveState(): void;
}
