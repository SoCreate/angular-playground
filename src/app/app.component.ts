import { Component, Inject, trigger, style, state, transition, animate, ViewChildren, ElementRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Sandbox, SelectedSandboxAndScenarioKeys} from './shared/app-state';
import {SANDBOXES} from './shared/tokens';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {StateService} from './shared/state.service';
import {EventManager} from "@angular/platform-browser";
import {UrlService} from "./shared/url.service";

@Component({
  selector: 'ap-root',
  animations: [
    trigger('flyInOut', [
      state('true', style({transform: 'translate(-50%, 0)'})),
      transition('void => *', [
        style({transform: 'translate(-50%, -110%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translate(-50%, -110%)'}))
      ])
    ])
  ],
  styles: [`
    :host * {
      box-sizing: border-box;
    }
    :host {
      font-family: sans-serif;
      display: flex;
      flex-direction: column; }
      :host .command-bar-shield {
        position: absolute;
        width: 100%;
        height: 100vh;
        opacity: 0; }
      :host .command-bar {
        z-index: 1;
        font-family: Menlo,Monaco,monospace;
        position: absolute;
        display: flex;
        flex-direction: column;
        left: 50%;
      }
      :host .command-bar > input {
        font-family: Menlo,Monaco,monospace;
        width: 365px;
        z-index: 1;
        padding: 4px;
        margin: 6px 0 0 5px;
        border: 1px solid #174a6c;
        background-color: #3c3c3c;
        font-size: 14pt;
        color: #fff;
      }
      :host .command-bar > input::-webkit-input-placeholder {
        color: #a9a9a9; }
      :host .command-bar > input::-moz-focus-inner {
        border: 0;
        padding: 0; }
      :host .command-bar > div {
        margin-top: -39px;
        width: 376px;
        padding: 34px 0 11px 0;
        background-color: #252526;
        color: #fff;
        box-shadow: 0 3px 8px 5px black;
      }
      :host .command-bar > div > div:first-child {
        margin-top: 12px;
        padding-top: 4px;
        border-top: 1px solid black;
      }
      :host .command-bar > div a {
        cursor: pointer; 
        display: block;
        width: 100%;
      }
      :host .command-bar > div a:hover,
      :host .command-bar > div a:focus {
        background-color: #0097fb;
        color: #fff;
        outline-style: none;
      }
      :host .command-bar .sandbox {
        font-style: italic;
        color: rgba(255, 255, 255, .5);
        padding: 2px 8px;
      }
      :host .command-bar .scenarios {
        display: flex;
      }
      :host .command-bar .scenario {
        padding: 2px 3px;
        margin: 0 5px;
      }
      :host .command-bar .scenario-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        fill: #fff;
        opacity: .2;
        margin: 4px 0 0 2px;
      }
      :host .command-bar .scenario-icon.selected {
        opacity: 1;
        fill: #0097fb;
      }
       
      :host section {
        border: 0;
        width: 100%;
        background-color: white; }
        
      :host section.help-message {
        display: flex;
        align-items: center;
        justify-content: center; 
        height: 100vh; }
      :host section.help-message > div {
        max-width: 50%;
        font-family: Menlo,Monaco,monospace; }
  `],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="icon-pin" viewBox="25 25 50 50">
        <path d="M70.32,34.393l-7.628-8.203c-0.854-0.916-2.256-1.066-3.281-0.342l-13.699,9.639c-0.479-0.055-0.956-0.082-1.425-0.082 c-5.935,0-9.126,4.326-9.259,4.51c-0.718,0.994-0.612,2.359,0.249,3.232l7.88,7.98L30.436,63.848c-0.98,0.98-0.98,2.568,0,3.549 c0.49,0.49,1.132,0.734,1.774,0.734c0.642,0,1.284-0.244,1.773-0.734l12.7-12.699l7.34,7.432c0.484,0.49,1.131,0.746,1.786,0.746 c0.436,0,0.874-0.113,1.27-0.346c4.014-2.357,3.876-9.373,3.557-12.727l9.799-12.125C71.22,36.707,71.171,35.307,70.32,34.393z M56.073,47.465c-0.432,0.535-0.626,1.225-0.536,1.906c0.332,2.51,0.239,5.236-0.146,7.002L40.678,41.475 c0.868-0.551,2.079-1.051,3.61-1.051c0.5,0,1.02,0.053,1.546,0.158c0.674,0.137,1.375-0.01,1.938-0.408l12.737-8.963l4.655,5.006 L56.073,47.465z"></path>
      </symbol>
    </svg>
    <div class="command-bar-shield" *ngIf="commandBarActive" (click)="toggleCommandBar()"></div>
    <div class="command-bar" *ngIf="commandBarActive" [@flyInOut]="commandBarActive">
      <input type="text" name="filter" placeholder="filter" 
        [formControl]="filter" 
        #filterElement
        [apFocus]="commandBarActive"
        (keyup.Esc)="commandBarActive = false"
        (keydown.ArrowDown)="goToFirstScenario($event)">
      <div>
        <div *ngFor="let sandbox of filteredSandboxes">
          <div class="sandbox"
               [class.selected]="selectedSandboxAndScenarioKeys.sandboxKey === sandbox.key">
            {{sandbox.prependText}}{{sandbox.name}}</div>
          <div *ngFor="let scenario of sandbox.scenarios" class="scenarios">
            <svg class="scenario-icon" [class.selected]="isSelected(sandbox, scenario)">
              <use xlink:href="#icon-pin"/>
            </svg>
            <a
               class="scenario"
               #scenarioElement
               [tabindex]="scenario.tabIndex"
               (keydown)="onScenarioLinkKeyDown(scenarioElement, filterElement, $event)"
               (keyup)="onScenarioLinkKeyUp(scenarioElement, $event)"
               (click)="onScenarioClick(sandbox.key, scenario.key, $event); toggleCommandBar()"
               [class.selected]="isSelected(sandbox, scenario)">
              {{scenario.description}}</a>
          </div>
        </div>
      </div>
    </div>
    <section *ngIf="!selectedSandboxAndScenarioKeys.sandboxKey" class="help-message">
      <div>
        <template [ngIf]="totalSandboxes > 0">
          <p>The app has {{totalSandboxes}} sandboxed component{{totalSandboxes > 1 ? 's' : ''}} loaded.</p>
        </template>
        <template [ngIf]="totalSandboxes === 0">
          <p>The app does not have any sandboxed components.</p>
        </template>
        <p>Pick sandboxed components: <strong>ctrl + o</strong></p>
      </div>
    </section>
    <section *ngIf="selectedSandboxAndScenarioKeys.sandboxKey">
      <ap-scenario [selectedSandboxAndScenarioKeys]="selectedSandboxAndScenarioKeys"></ap-scenario>
    </section>
  `
})
export class AppComponent {
  commandBarActive = false;
  totalSandboxes: number;
  filteredSandboxes: Sandbox[];
  selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
  filter = new FormControl();
  @ViewChildren('scenarioElement') scenarioLinkElements;

  constructor(@Inject(SANDBOXES) sandboxes: Sandbox[],
              private stateService: StateService,
              private urlService: UrlService,
              private eventManager: EventManager) {
    if(this.urlService.embed) {
      this.selectScenario(this.urlService.embed.sandboxKey, this.urlService.embed.scenarioKey);
    } else {
      if (this.urlService.select) {
        this.stateService.setFilter(this.urlService.select.filter);
        this.stateService.setSandboxAndScenarioKeys({sandboxKey: this.urlService.select.sandboxKey, scenarioKey: this.urlService.select.scenarioKey});
      }
      this.eventManager.addGlobalEventListener('window',
        'keydown.control.o',
        (e) => {
          e.preventDefault();
        });
      this.eventManager.addGlobalEventListener('window',
        'keyup.control.o',
        () => {
          this.toggleCommandBar();
        });
      this.totalSandboxes = sandboxes.length;
      this.selectedSandboxAndScenarioKeys = this.stateService.getSelectedSandboxAndScenarioKeys();
      let filterValue = this.stateService.getFilter();
      this.filteredSandboxes = this.filterSandboxes(sandboxes, filterValue);
      this.filter.setValue(filterValue);
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
  }

  goToFirstScenario(event) {
    event.preventDefault();
    this.focusScenarioLinkElement(0);
  }

  onScenarioLinkKeyDown(scenarioElement, filterElement, event) {
    event.preventDefault();
    switch(event.key) {
      case 'ArrowUp':
        this.goUp(scenarioElement);
        break;
      case 'ArrowDown':
        this.goDown(scenarioElement);
        break;
      default:
        if (event.key !== 'Escape' && event.key !== 'Enter') {
          if(event.key.length === 1) {
            this.filter.setValue(`${this.filter.value}${event.key}`);
          }
          filterElement.focus();
        }
        break;
    }
  }

  onScenarioLinkKeyUp(scenarioElement, event) {
    event.preventDefault();
    switch(event.key) {
      case 'Escape':
        this.commandBarActive = false;
        break;
      case 'Enter':
        scenarioElement.click();
        break;
    }
  }

  onScenarioClick(sandboxKey, scenarioKey, e) {
    this.selectScenario(sandboxKey, scenarioKey);
    e.preventDefault();
  }

  isSelected(sandbox, scenario) {
    return this.selectedSandboxAndScenarioKeys.scenarioKey === scenario.key
      && this.selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase() === sandbox.key.toLowerCase();
  }

  private goUp(scenarioElement) {
    let currentIndex = -1;
    this.scenarioLinkElements.find((scenarioElementRef: ElementRef, index) => {
      if(scenarioElementRef.nativeElement === scenarioElement) {
        currentIndex = index;
      }
    });
    if(currentIndex === 0) {
      this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
    } else {
      this.focusScenarioLinkElement(currentIndex +- 1);
    }
  }

  private goDown(scenarioElement) {
    let currentIndex = -1;
    this.scenarioLinkElements.find((scenarioElementRef: ElementRef, index) => {
      if(scenarioElementRef.nativeElement === scenarioElement) {
        currentIndex = index;
      }
    });
    if(currentIndex === this.scenarioLinkElements.length - 1) {
      this.focusScenarioLinkElement(0);
    } else {
      this.focusScenarioLinkElement(currentIndex + 1);
    }
  }

  private focusScenarioLinkElement(index) {
    if(this.scenarioLinkElements.toArray()[index]) {
      this.scenarioLinkElements.toArray()[index].nativeElement.focus();
    }
  }

  private filterSandboxes(sandboxes, filter) {
    if (!filter) {
      return [];
    }
    let tabIndex = 0;
    return sandboxes
      .filter((sandbox: Sandbox) => sandbox.key.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
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
      })
      .map(sandbox => Object.assign({}, sandbox, {tabIndex: tabIndex++}));
  }

  private toggleCommandBar() {
    this.commandBarActive = !this.commandBarActive;
  }

  private selectScenario(sandboxKey, scenarioKey) {
    this.selectedSandboxAndScenarioKeys = {sandboxKey, scenarioKey};
    this.stateService.setSandboxAndScenarioKeys(this.selectedSandboxAndScenarioKeys);
  }
}
