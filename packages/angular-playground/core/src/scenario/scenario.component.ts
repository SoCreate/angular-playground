import { Component, Input, NgZone, NgModule, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LoaderService } from '../shared/loader.service';
import { Scenario, SelectedSandboxAndScenarioKeys } from '../../lib/app-state';
import { BrowserModule } from '@angular/platform-browser';

@Component({
    selector: 'ap-scenario',
    template: `<ng-template></ng-template>`
})
export class ScenarioComponent implements OnInit, OnChanges {
    /**
     * The selected sandbox and scenario provided from the app dropdown
     */
    @Input() selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;

    constructor(private zone: NgZone) {
    }

    ngOnInit() {
        if (this.selectedSandboxAndScenarioKeys) {
            this.bootstrapSandbox(this.selectedSandboxAndScenarioKeys);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedSandboxAndScenarioKeys) {
            this.bootstrapSandbox(changes.selectedSandboxAndScenarioKeys.currentValue)
        }
    }

    /**
     * Bootstrap a new Angular application with the sandbox's required dependencies
     */
    private bootstrapSandbox(selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys) {
        LoaderService.loadSandbox(selectedSandboxAndScenarioKeys.sandboxKey).then(sandbox => {
            if (sandbox) {
                const scenario = sandbox.scenarios
                    .find((s: Scenario) => s.key === selectedSandboxAndScenarioKeys.scenarioKey);

                if (scenario) {
                    // Don't bootstrap a new Angular application within an existing zone
                    this.zone.runOutsideAngular(() => {
                        const module = this.createModule(sandbox, scenario);
                        platformBrowserDynamic().bootstrapModule(module)
                            .catch(err => console.error(err));
                    });
                }
            }
        });
    }

    /**
     * Create a module containing the dependencies of a sandbox
     */
    private createModule(sandboxMeta, scenario) {
        const hostComp = this.createComponent(scenario);

        class DynamicModule {
            ngDoBootstrap(app) {
                // TODO: Destroy other app instances
                const compEl = document.createElement('playground-host');
                document.body.appendChild(compEl);
                app.bootstrap(hostComp);
            }
        }

        return NgModule({
            imports: [BrowserModule, ...sandboxMeta.imports],
            declarations: [
                hostComp,
                sandboxMeta.declareComponent ? sandboxMeta.type : [],
                ...sandboxMeta.declarations
            ],
            providers: [...sandboxMeta.providers],
            entryComponents: [hostComp]
        })(DynamicModule);
    }

    /**
     * Construct a component to serve as the host for the provided scenario
     */
    private createComponent(scenario: Scenario) {
        class DynamicComponent {
            constructor() {
                Object.assign(this, scenario.context);
            }
        }

        return Component({
            selector: 'playground-host',
            template: scenario.template,
            styles: scenario.styles,
            providers: scenario.providers
        })(DynamicComponent);
    }
}
