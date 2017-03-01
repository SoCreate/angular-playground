import {
  Component,
  ViewContainerRef,
  ChangeDetectionStrategy, NgModule, Injector, Compiler, Input, Inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sandbox, Scenario, SelectedSandboxAndScenarioKeys } from '../shared/app-state';
import { SANDBOXES } from '../shared/tokens';

@Component({
  selector: 'ap-scenario',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScenarioComponent {
  @Input() set selectedSandboxAndScenarioKeys(selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys) {
    this.view.clear();
    if (selectedSandboxAndScenarioKeys) {
      let sandbox: Sandbox = this.sandboxes.find((sandbox: Sandbox) => sandbox.key.toLowerCase() === selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase());
      if (sandbox) {
        let scenario = sandbox.scenarios.find((scenario: Scenario) => scenario.key === selectedSandboxAndScenarioKeys.scenarioKey);
        if (scenario) {
          this.loadScenario(sandbox, scenario, this.view, this.injector);
        }
      }
    }
  };

  constructor(@Inject(SANDBOXES) private sandboxes: Sandbox[],
              private compiler: Compiler,
              private injector: Injector,
              private view: ViewContainerRef) {
  }

  private loadScenario(sandbox: Sandbox, scenario: Scenario, location: ViewContainerRef, injector: Injector) {
    let hostComponent = this.hostComponent(scenario);
    let hostModule = this.hostModule(sandbox, hostComponent);
    this.compiler.clearCache();
    let moduleFactory = this.compiler.compileModuleSync(hostModule);
    let moduleRef = moduleFactory.create(injector);
    let componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(hostComponent);
    location.createComponent(componentFactory, location.length, moduleRef.injector);
  }

  private hostComponent(scenario: Scenario) {
    @Component({
      selector: 'host-component',
      template: scenario.template,
      styles: scenario.styles,
      providers: scenario.providers
    })
    class HostComponent {
      constructor() {
        Object.assign(this, scenario.context);
      }
    }
    return HostComponent;
  }

  private hostModule(sandbox: Sandbox, hostComponent: any) {
    let {imports, type, declarations, providers} = sandbox;
    @NgModule({
      imports: [
        CommonModule,
        imports ? imports : []
      ],
      declarations: [
        type,
        hostComponent,
        declarations ? declarations : []
      ],
      providers: providers ? providers : [],
      entryComponents: [
        hostComponent
      ]
    })
    class HostModule {
    }
    return HostModule;
  }
}
