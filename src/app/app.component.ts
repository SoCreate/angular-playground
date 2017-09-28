import { Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SandboxMenuItem, SelectedSandboxAndScenarioKeys } from './shared/app-state';
import { SANDBOX_MENU_ITEMS } from './shared/tokens';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { StateService } from './shared/state.service';
import { EventManager } from '@angular/platform-browser';
import { UrlService } from './shared/url.service';
import { fuzzySearch } from './shared/fuzzy-search.function';

@Component({
  selector: 'ap-root',
  styles: [`

    /* Globals */
    * {
      box-sizing: border-box;
    }

    :host {
      display: flex;
      flex-direction: column;
    }

    /* Shield */
    .shield {
      height: 100vh;
      opacity: 0;
      position: absolute;
      z-index: 2;
      width: 100%;
    }

    /* Command Bar */
    .command-bar {
      background-color: #252526;
      box-shadow: 0 3px 8px 5px black;
      color: white;
      display: flex;
      flex-direction: column;
      font-family: Menlo, Monaco, monospace;
      left: 50%;
      margin-top: -6px;
      max-height: 100vh;
      padding-top: 10px;
      position: absolute;
      transform: translate(-50%, -110%);
      transition: transform ease 100ms;
      width: 376px;
      z-index: 9999999999999;
    }

    .command-bar::before {
      border-bottom: solid 1px black;
      content: "";
      display: block;
      position: absolute;
      top: 54px;
      width: 100%;
    }

    .command-bar--open {
      transform: translate(-50%, 0);
    }

    .command-bar__filter {
      background-color: #3c3c3c;
      border: 1px solid #174a6c;
      color: white;
      font-family: Menlo, Monaco, monospace;
      font-size: 14pt;
      margin: 6px 0 0 5px;
      padding: 4px;
      width: 365px;
      z-index: 1;
    }

    .command-bar__filter::placeholder {
      color: #a9a9a9;
    }

    .command-bar__filter:-ms-input-placeholder {
      color: #a9a9a9;
    }

    .command-bar__filter::-moz-focus-inner {
      border: 0;
      padding: 0;
    }

    /* Sandboxes */
    .command-bar__sandboxes {
      border-top: solid 1px rgba(255, 255, 255, .1);
      margin-top: 9px;
      overflow: auto;
      position: relative;
    }

    .command-bar__sandbox {
      border-bottom: solid 1px black;
      border-top: solid 1px rgba(255, 255, 255, .1);
      padding: 8px 6px 14px;
    }

    .command-bar__sandbox:first-child {
      border-top: none;
    }

    .command-bar__sandbox:last-child {
      border-bottom: none;
      padding-bottom: 12px;
    }

    .command-bar__title {
      align-items: center;
      color: rgba(255, 255, 255, .5);
      display: flex;
      font-size: 12px;
      font-weight: normal;
      justify-content: space-between;
      margin: 0 0 5px;
      padding: 5px 0 0;
    }

    .command-bar__title-text {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .command-bar__prepend-text {
      background: rgba(255, 255, 255, .1);
      border-radius: 2px;
      display: block;
      font-size: 9px;
      margin-left: 10px;
      order: 1;
      padding: 4px 4px 3px;
    }

    /* Scenarios */
    .command-bar__scenarios {
      display: flex;
    }

    .command-bar__scenario-link {
      align-items: center;
      border-radius: 2px;
      color: rgba(255, 255, 255, .5);
      cursor: pointer;
      display: flex;
      padding: 2px 3px;
      width: 100%;
    }

    .command-bar__scenario-link:hover,
    .command-bar__scenario-link:active,
    .command-bar__scenario-link:focus {
      background-color: #0097fb;
      color: white;
      outline-style: none;
    }

    .command-bar__scenario-icon {
      display: inline-block;
      fill: white;
      height: 20px;
      margin: 4px 6px 0 0;
      opacity: .2;
      width: 20px;
    }

    .command-bar__scenario-link:hover .command-bar__scenario-icon,
    .command-bar__scenario-link:active .command-bar__scenario-icon,
    .command-bar__scenario-link:focus .command-bar__scenario-icon {
      opacity: .5;
    }

    .command-bar__scenario-link--selected {
      color: white;
    }

    .command-bar__scenario-icon--selected {
      fill: #0097fb;
      opacity: 1;
    }

    .command-bar__scenario-link:hover .command-bar__scenario-icon--selected,
    .command-bar__scenario-link:active .command-bar__scenario-icon--selected,
    .command-bar__scenario-link:focus .command-bar__scenario-icon--selected {
      fill: white;
    }

    /* Content */
    .content {
      align-items: center;
      border: 0;
      display: flex;
      height: 100vh;
      justify-content: center;
      position: relative;
      width: 100%;
    }

    .content__none {
      font-family: Menlo, Monaco, monospace;
      max-width: 50%;
    }

    .content__none em {
      color: #666;
    }

  `],
  template: `
    <div class="shield" *ngIf="commandBarActive" (click)="toggleCommandBar()"></div>
    <div class="command-bar" *ngIf="commandBarActive" [class.command-bar--open]="commandBarActive">
      <input
        class="command-bar__filter"
        type="text"
        name="filter"
        placeholder="filter"
        [formControl]="filter"
        #filterElement
        [apFocus]="commandBarActive"
        (keyup.Esc)="commandBarActive = false"
        (keydown.ArrowUp)="goToLastScenario($event)"
        (keydown.ArrowDown)="goToFirstScenario($event)">
      <div class="command-bar__sandboxes">
        <div class="command-bar__sandbox" *ngFor="let sandboxMenuItem of filteredSandboxMenuItems">
          <h2 class="command-bar__title" title="{{sandboxMenuItem.label}} {{sandboxMenuItem.name}}" [class.command-bar__sandbox-title--selected]="selectedSandboxAndScenarioKeys.sandboxKey === sandboxMenuItem.key">
            <span class="command-bar__prepend-text" *ngIf="sandboxMenuItem.label">
              {{sandboxMenuItem.label}}
            </span>
            <span class="command-bar__title-text">
              {{sandboxMenuItem.name}}
            </span>
          </h2>
          <div class="command-bar__scenarios" *ngFor="let scenarioMenuItem of sandboxMenuItem.scenarioMenuItems">
            <a
              class="command-bar__scenario-link"
              #scenarioElement
              [tabindex]="scenarioMenuItem.tabIndex"
              (keydown)="onScenarioLinkKeyDown(scenarioElement, filterElement, $event)"
              (keyup)="onScenarioLinkKeyUp(scenarioElement, $event)"
              (click)="onScenarioClick(sandboxMenuItem.key, scenarioMenuItem.key, $event); toggleCommandBar()"
              [class.command-bar__scenario-link--selected]="isSelected(sandboxMenuItem, scenarioMenuItem)">
              <svg class="command-bar__scenario-icon" [class.command-bar__scenario-icon--selected]="isSelected(sandboxMenuItem, scenarioMenuItem)" viewBox="25 25 50 50">
                <path d="M70.32,34.393l-7.628-8.203c-0.854-0.916-2.256-1.066-3.281-0.342l-13.699,9.639c-0.479-0.055-0.956-0.082-1.425-0.082 c-5.935,0-9.126,4.326-9.259,4.51c-0.718,0.994-0.612,2.359,0.249,3.232l7.88,7.98L30.436,63.848c-0.98,0.98-0.98,2.568,0,3.549 c0.49,0.49,1.132,0.734,1.774,0.734c0.642,0,1.284-0.244,1.773-0.734l12.7-12.699l7.34,7.432c0.484,0.49,1.131,0.746,1.786,0.746 c0.436,0,0.874-0.113,1.27-0.346c4.014-2.357,3.876-9.373,3.557-12.727l9.799-12.125C71.22,36.707,71.171,35.307,70.32,34.393z M56.073,47.465c-0.432,0.535-0.626,1.225-0.536,1.906c0.332,2.51,0.239,5.236-0.146,7.002L40.678,41.475 c0.868-0.551,2.079-1.051,3.61-1.051c0.5,0,1.02,0.053,1.546,0.158c0.674,0.137,1.375-0.01,1.938-0.408l12.737-8.963l4.655,5.006 L56.073,47.465z"></path>
              </svg>
              {{scenarioMenuItem.description}}</a>
          </div>
        </div>
      </div>
    </div>
    <section class="content">
      <div class="content__none" *ngIf="!selectedSandboxAndScenarioKeys.sandboxKey">
        <p *ngIf="totalSandboxes > 0">
          The app has {{totalSandboxes}} sandboxed component{{totalSandboxes > 1 ? 's' : ''}} loaded.
        </p>
        <p *ngIf="totalSandboxes === 0">
          The app does not have any sandboxed components.
        </p>
        <p>
          Pick sandboxed components: <strong>ctrl + o</strong> <em>or</em> <strong>F1</strong>
        </p>
      </div>
      <ng-container *ngIf="selectedSandboxAndScenarioKeys.sandboxKey">
        <ap-scenario [selectedSandboxAndScenarioKeys]="selectedSandboxAndScenarioKeys"></ap-scenario>
      </ng-container>
    </section>
  `
})
export class AppComponent {
  commandBarActive = false;
  totalSandboxes: number;
  filteredSandboxMenuItems: SandboxMenuItem[];
  selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys = {sandboxKey: null, scenarioKey: null};
  filter = new FormControl();
  @ViewChildren('scenarioElement') scenarioLinkElements: QueryList<ElementRef>;

  constructor(@Inject(SANDBOX_MENU_ITEMS) sandboxMenuItems: SandboxMenuItem[],
              private stateService: StateService,
              private urlService: UrlService,
              private eventManager: EventManager) {

    if (this.urlService.embed) {
      this.selectedSandboxAndScenarioKeys = {
        sandboxKey: this.urlService.select.sandboxKey,
        scenarioKey: this.urlService.select.scenarioKey
      };
    } else {
      let filterValue = this.stateService.getFilter();
      if (this.urlService.select) {
        filterValue = (filterValue && fuzzySearch(filterValue.toLowerCase(), this.urlService.select.filter.toLowerCase())) ? filterValue : this.urlService.select.filter;
        this.selectedSandboxAndScenarioKeys = {
          sandboxKey: this.urlService.select.sandboxKey,
          scenarioKey: this.urlService.select.scenarioKey
        };
      }
      this.eventManager.addGlobalEventListener('window',
        'keydown.control.o',
        (e: any) => {
          e.preventDefault();
        });
      this.eventManager.addGlobalEventListener('window',
        'keyup.control.o',
        () => {
          this.toggleCommandBar();
        });
      this.eventManager.addGlobalEventListener('window',
        'keydown.F1',
        (e: any) => {
          e.preventDefault();
        });
      this.eventManager.addGlobalEventListener('window',
        'keyup.F1',
        () => {
          this.toggleCommandBar();
        });
      this.totalSandboxes = sandboxMenuItems.length;
      this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, filterValue);
      this.filter.setValue(filterValue);
      this.filter.valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe(value => {
          this.stateService.setFilter(value);
          this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, value);
          if (!value) {
            this.selectScenario(null, null);
          }
        });
    }
  }

  goToFirstScenario(event: any) {
    event.preventDefault();
    const currentIndex = this.findCurrentScenarioIndex();

    if (currentIndex) {
      this.focusScenarioLinkElement(currentIndex);
    } else {
      this.focusScenarioLinkElement(0);
    }
  }

  goToLastScenario(event: any) {
    event.preventDefault();
    const currentIndex = this.findCurrentScenarioIndex();

    if (currentIndex) {
      this.focusScenarioLinkElement(currentIndex);
    } else if (this.scenarioLinkElements.length > 0) {
      this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
    }
  }

  onScenarioLinkKeyDown(scenarioElement: any, filterElement: any, event: any) {
    event.preventDefault();
    switch (event.key) {
      case 'Up':
      case 'ArrowUp':
        this.goUp(scenarioElement);
        break;
      case 'Down':
      case 'ArrowDown':
        this.goDown(scenarioElement);
        break;
      default:
        if (event.key !== 'Escape' && event.key !== 'Enter') {
          if (event.key.length === 1) {
            this.filter.setValue(`${this.filter.value}${event.key}`);
          }
          filterElement.focus();
        }
        break;
    }
  }

  onScenarioLinkKeyUp(scenarioElement: any, event: any) {
    event.preventDefault();
    switch (event.key) {
      case 'Escape':
        this.commandBarActive = false;
        break;
      case 'Enter':
        scenarioElement.click();
        break;
    }
  }

  onScenarioClick(sandboxKey: string, scenarioKey: number, e: any) {
    this.selectScenario(sandboxKey, scenarioKey);
    e.preventDefault();
  }

  isSelected(sandbox: any, scenario: any) {
    return this.selectedSandboxAndScenarioKeys.scenarioKey === scenario.key
      && this.selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase() === sandbox.key.toLowerCase();
  }

  private findCurrentScenarioIndex(): number | undefined {
    let currentIndex;

    if (this.scenarioLinkElements.length > 0) {
      this.scenarioLinkElements.map((element: ElementRef, i: number) => {
        if (element.nativeElement.className.includes('selected')) {
          currentIndex = i;
        }
      });
    }

    return currentIndex;
  }

  private goUp(scenarioElement: any) {
    let currentIndex = -1;

    this.scenarioLinkElements.forEach((scenarioElementRef: ElementRef, index: number) => {
      if (scenarioElementRef.nativeElement === scenarioElement) {
        currentIndex = index;
      }
    });

    if (currentIndex === 0) {
      this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
    } else {
      this.focusScenarioLinkElement(currentIndex - 1);
    }
  }

  private goDown(scenarioElement: any) {
    let currentIndex = -1;

    this.scenarioLinkElements.forEach((scenarioElementRef: ElementRef, index: number) => {
      if (scenarioElementRef.nativeElement === scenarioElement) {
        currentIndex = index;
      }
    });

    if (currentIndex === this.scenarioLinkElements.length - 1) {
      this.focusScenarioLinkElement(0);
    } else {
      this.focusScenarioLinkElement(currentIndex + 1);
    }
  }

  private focusScenarioLinkElement(index: number) {
    if (this.scenarioLinkElements.toArray()[index]) {
      this.scenarioLinkElements.toArray()[index].nativeElement.focus();
    }
  }

  private filterSandboxes(sandboxMenuItems: SandboxMenuItem[], filter: string) {
    if (!filter) {
      return [];
    }
    let tabIndex = 0;
    let filterNormalized = filter.toLowerCase();
    return sandboxMenuItems
      .filter((sandboxMenuItem: SandboxMenuItem) => fuzzySearch(filterNormalized, sandboxMenuItem.searchKey.toLowerCase()))
      .sort((a: SandboxMenuItem, b: SandboxMenuItem) => {
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

  private selectScenario(sandboxKey: string, scenarioKey: number) {
    this.selectedSandboxAndScenarioKeys = {sandboxKey, scenarioKey};
    this.urlService.setSelected(sandboxKey, scenarioKey);
  }
}
