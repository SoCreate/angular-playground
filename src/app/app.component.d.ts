import { FormControl } from '@angular/forms';
import { Sandbox, SelectedSandboxAndScenarioKeys } from './shared/app-state';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { StateService } from './shared/state.service';
export declare class AppComponent {
    private stateService;
    totalSandboxes: number;
    filteredSandboxes: Sandbox[];
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
    filter: FormControl;
    constructor(sandboxes: Sandbox[], stateService: StateService);
    private filterSandboxes(sandboxes, filter);
    selectScenario(sandboxKey: any, scenarioKey: any): void;
}
