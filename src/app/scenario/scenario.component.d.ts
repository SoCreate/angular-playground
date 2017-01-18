import { ViewContainerRef, Injector, Compiler } from '@angular/core';
import { SelectedSandboxAndScenarioKeys } from '../shared/app-state';
export declare class ScenarioComponent {
    private sandboxes;
    private compiler;
    private injector;
    private view;
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
    constructor(sandboxes: any, compiler: Compiler, injector: Injector, view: ViewContainerRef);
    private loadScenario(sandbox, scenario, location, injector);
    private hostComponent(scenario);
    private hostModule({imports, type, declarations, providers}, hostComponent);
}
