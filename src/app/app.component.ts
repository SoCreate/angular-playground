import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sandbox, SelectedSandboxAndScenarioKeys } from './shared/app-state';
import {
  SANDBOXES, INITIAL_FILTER, INITIAL_SELECTED_SANDBOX_KEY,
  INITIAL_SELECTED_SCENARIO_KEY
} from './shared/tokens';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { StateService } from './shared/state.service';

@Component({
  selector: 'ap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  totalSandboxes: number;
  filteredSandboxes: Sandbox[];
  selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
  filter = new FormControl();

  constructor(@Inject(SANDBOXES) sandboxes: Sandbox[],
              private stateService: StateService) {
    this.totalSandboxes = sandboxes.length;
    this.filteredSandboxes = this.filterSandboxes(sandboxes, this.stateService.getFilter());
    let {sandboxKey, scenarioKey} = this.stateService.getSelectedSandboxAndScenarioKeys();
    this.selectScenario(sandboxKey, scenarioKey);
    this.filter.setValue(this.stateService.getFilter());
    this.filter.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.filteredSandboxes = this.filterSandboxes(sandboxes, value);
        this.stateService.setFilter(value);
        if(!value) {
          this.selectScenario(null, null);
        }
      });
  }

  private filterSandboxes(sandboxes, filter) {
    if (!filter) {
      return [];
    }
    return sandboxes
      .filter((sandbox: Sandbox) => sandbox.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
      .sort((a: Sandbox, b: Sandbox) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
  }

  selectScenario(sandboxKey, scenarioKey) {
    this.selectedSandboxAndScenarioKeys = {sandboxKey, scenarioKey};
    this.stateService.setSandboxAndScenarioKeys(this.selectedSandboxAndScenarioKeys);
  }
}
