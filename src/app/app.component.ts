import {Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Sandbox, SelectedSandboxAndScenarioKeys} from './shared/app-state';
import {SANDBOXES} from './shared/tokens';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {StateService} from './shared/state.service';
import {EventManager} from "@angular/platform-browser";

@Component({
  selector: 'ap-root',
  template: `
    <div *ngIf="commandBarActive" class="command-bar">
      <input type="text" name="filter" placeholder="filter" [formControl]="filter">
      <div>
        <div *ngFor="let sandbox of filteredSandboxes">
          <span class="sandbox"
                [class.selected]="selectedSandboxAndScenarioKeys?.sandboxKey === sandbox.key">
            {{sandbox.prependText}}{{sandbox.name}}</span>
          <div *ngFor="let scenario of sandbox.scenarios"
               (click)="selectScenario(sandbox.key, scenario.key); toggleCommandBar()">
            <a class="scenario"
               [class.selected]="selectedSandboxAndScenarioKeys?.scenarioKey === scenario.key && selectedSandboxAndScenarioKeys?.sandboxKey === sandbox.key">
              {{scenario.description}}</a>
          </div>
        </div>
      </div>
    </div>
    <aside *ngIf="selectedSandboxAndScenarioKeys">
      <header>Angular Playground</header>
    </aside>
    <section>
      <div *ngIf="!selectedSandboxAndScenarioKeys" class="help-message">
        <template [ngIf]="totalSandboxes > 0">
          <p>The app has {{totalSandboxes}} sandboxed component{{totalSandboxes > 1 ? 's' : ''}} loaded.</p>
          <p *ngIf="totalSandboxes > 1">Use the filter to find one to play in!</p>
          <p *ngIf="totalSandboxes === 1">Use the filter to find it!</p>
        </template>
        <template [ngIf]="totalSandboxes === 0">
          <p>The app does not have any sandboxed components.</p>
        </template>
      </div>
      <ap-scenario *ngIf="selectedSandboxAndScenarioKeys"
        [selectedSandboxAndScenarioKeys]="selectedSandboxAndScenarioKeys"></ap-scenario>
    </section>
  `,
  styles: [`
    :host {
      font-family: sans-serif;
      display: flex;
      flex-direction: column; }
      :host .command-bar {
        position: absolute;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
      :host .command-bar > input {
        width: 400px;
        z-index: 1;
        padding: 4px;
        margin-top: 16px;
        border-radius: 6px;
      }
      :host .command-bar > input::-moz-focus-inner {
        border: 0;
        padding: 0; }
      :host .command-bar > div {
        margin-top: -38px;
        width: 400px;
        padding: 34px 14px 14px 14px;
        border-radius: 8px;
        background-color: #333;
        color: #fff;
      }
      :host .command-bar > div > div:first-child {
        padding-top: 18px;
      }
      :host .command-bar > div a {
        cursor: pointer; }
      :host input {
        color: inherit;
        font: inherit;
        margin: 0; }
      :host input::-moz-focus-inner {
        border: 0;
        padding: 0; }
      :host input {
        line-height: normal; }
      :host aside {
        padding: 14px;
        background-color: #ebebeb; 
        display: flex; }
        :host aside header {
          border: 2px solid #666;
          font-size: .8em;
          text-transform: uppercase;
          padding: 4px;
          text-align: center;
          margin-bottom: 4px; }
        :host aside input[type="text"] {
          margin-bottom: 4px;
          width: 196px; }
        :host aside a {
          cursor: pointer; }
        :host aside .sandbox.selected, :host aside .scenario.selected {
          font-weight: bold; }
        :host aside .scenario {
          font-size: .8em;
          padding: 0 8px; }
        :host aside .help-message {
          text-align: center;
          font-style: italic;
          font-size: .9em;
          color: #999;
          padding: 40px 10px; }
      :host section {
        border: 0;
        width: 100%;
        background-color: white; }
  `]
})
export class AppComponent {
  commandBarActive = false;
  totalSandboxes: number;
  filteredSandboxes: Sandbox[];
  selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
  filter = new FormControl();

  constructor(@Inject(SANDBOXES) sandboxes: Sandbox[],
              private stateService: StateService,
              private eventManager: EventManager) {
    this.eventManager.addGlobalEventListener('window',
      'keydown.control.p',
      (e) => {
        e.preventDefault();
      });
    this.eventManager.addGlobalEventListener('window',
      'keyup.control.p',
      () => {
        this.toggleCommandBar();
      });
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
        if (!value) {
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

  private toggleCommandBar() {
    this.commandBarActive = !this.commandBarActive;
  }

  selectScenario(sandboxKey, scenarioKey) {
    this.selectedSandboxAndScenarioKeys = {sandboxKey, scenarioKey};
    this.stateService.setSandboxAndScenarioKeys(this.selectedSandboxAndScenarioKeys);
  }
}
