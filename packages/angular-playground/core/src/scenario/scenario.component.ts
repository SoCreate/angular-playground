import {
    Component, Input, NgZone, NgModule, OnChanges, OnInit, SimpleChanges, NgModuleRef, Inject, OnDestroy
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SandboxLoader } from '../shared/sandbox-loader';
import { Scenario, SelectedSandboxAndScenarioKeys, Sandbox } from '../../lib/app-state';
import { BrowserModule } from '@angular/platform-browser';
import { Middleware, MIDDLEWARE } from '../../lib/middlewares';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'ap-scenario',
    template: `<ng-template></ng-template>`
})
export class ScenarioComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * The selected sandbox and scenario provided from the app dropdown
     */
    @Input() selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;

    /**
     * Collection of bootstrapped apps
     */
    private activeApps: NgModuleRef<any>[] = [];

    /**
     * Modules that are applied across every sandbox instance
     */
    private activeMiddleware: Middleware;

    /**
     * Unsubscribe all subscriptions on component destroy
     */
    private onDestroy = new Subject<void>();

    constructor(private zone: NgZone, @Inject(MIDDLEWARE) private middleware) {
    }

    ngOnInit() {
        this.middleware
            .pipe(takeUntil(this.onDestroy))
            .subscribe(middlewares => this.activeMiddleware = middlewares);

        if (this.selectedSandboxAndScenarioKeys) {
            this.bootstrapSandbox(this.selectedSandboxAndScenarioKeys);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedSandboxAndScenarioKeys) {
            this.bootstrapSandbox(changes.selectedSandboxAndScenarioKeys.currentValue)
        }
    }

    ngOnDestroy() {
        this.onDestroy.next();

        // this cleans up the DOM when a sandboxed component is loaded and the search bar is then cleared
        if (this.activeApps.length > 0) {
            // destroy sandboxed app (doesn't remove it from the DOM though)
            const app = this.activeApps.pop();
            app.destroy();

            // remove the sandboxed component's element from the dom
            const hostElement = document.querySelector('playground-host');
            if (hostElement && hostElement.children) {
                hostElement.children[0].remove();
            }
        }
    }

    /**
     * Bootstrap a new Angular application with the sandbox's required dependencies
     */
    private bootstrapSandbox(selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys) {
        SandboxLoader.loadSandbox(selectedSandboxAndScenarioKeys.sandboxKey).then(sandbox => {
            if (sandbox) {
                const scenario = sandbox.scenarios
                    .find((s: Scenario) => s.key === selectedSandboxAndScenarioKeys.scenarioKey);

                if (scenario) {
                    if (this.activeApps.length > 0) {
                        const app = this.activeApps.pop();
                        app.destroy();
                    }

                    // Don't bootstrap a new Angular application within an existing zone
                    this.zone.runOutsideAngular(() => {
                        const module = this.createModule(sandbox, scenario);
                        platformBrowserDynamic().bootstrapModule(module)
                            .then(app => this.activeApps.push(app))
                            .catch(err => console.error(err));
                    });
                }
            }
        });
    }

    /**
     * Create a module containing the dependencies of a sandbox
     */
    private createModule(sandboxMeta: Sandbox, scenario) {
        const hostComp = this.createComponent(scenario);

        class DynamicModule {
            ngDoBootstrap(app) {
                const hostEl = document.querySelector('playground-host');
                if (!hostEl) {
                    const compEl = document.createElement('playground-host');
                    document.body.appendChild(compEl);
                }
                app.bootstrap(hostComp);
            }
        }

        return NgModule({
            imports: [
                BrowserModule,
                ...sandboxMeta.imports,
                ...this.activeMiddleware.modules
            ],
            declarations: [
                hostComp,
                sandboxMeta.declareComponent ? sandboxMeta.type : [],
                ...sandboxMeta.declarations
            ],
            providers: [...sandboxMeta.providers],
            entryComponents: [hostComp, ...sandboxMeta.entryComponents],
            schemas: [...sandboxMeta.schemas]
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
