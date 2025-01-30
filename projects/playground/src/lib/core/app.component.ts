import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SandboxMenuItem, SelectedSandboxAndScenarioKeys } from '../lib/app-state';
import { StateService } from './shared/state.service';
import { UrlService } from './shared/url.service';
import { fuzzySearch } from './shared/fuzzy-search.function';
import { LevenshteinDistance } from './shared/levenshtein-distance';
import { Middleware, MIDDLEWARE } from '../lib/middlewares';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Sandboxes } from "./shared/sandboxes";

@Component({
    selector: 'playground-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false,
})
export class AppComponent implements OnInit {
    @ViewChildren('scenarioElement') scenarioLinkElements: QueryList<ElementRef>;
    commandBarActive = false;
    commandBarPreview = false;
    totalSandboxes: number;
    filteredSandboxMenuItems: SandboxMenuItem[];
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys = {sandboxKey: null, scenarioKey: null};
    filter = new FormControl();
    shortcuts = this.getShortcuts();
    activeMiddleware: Middleware;
    embed = false;

    constructor(
        private stateService: StateService,
        private urlService: UrlService,
        private renderer: Renderer2,
        private levenshteinDistance: LevenshteinDistance,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(MIDDLEWARE) private middleware: Observable<Middleware>,
        private sandboxes: Sandboxes
    ) {
    }

    ngOnInit() {
        const sandboxMenuItems = this.sandboxes.getSandboxMenuItems();

        this.middleware
            .subscribe(middleware => this.activeMiddleware = middleware);

        this.embed = this.urlService.embed;
        if (this.embed) {
            this.selectedSandboxAndScenarioKeys = {
                sandboxKey: this.urlService.select.sandboxKey,
                scenarioKey: this.urlService.select.scenarioKey,
            };
        } else {
            if (this.urlService.select) {
                this.selectedSandboxAndScenarioKeys = {
                    sandboxKey: this.urlService.select.sandboxKey,
                    scenarioKey: this.urlService.select.scenarioKey,
                };
            }

            this.renderer.listen('window', 'keydown.control.p', this.blockEvent);
            this.renderer.listen('window', 'keydown.F2', this.blockEvent);

            this.renderer.listen('window', 'keyup.control.p', (event: KeyboardEvent) => {
                this.blockEvent(event);
                this.toggleCommandBar();
            });

            this.renderer.listen('window', 'keyup.F2', (event: KeyboardEvent) => {
                this.blockEvent(event);
                this.toggleCommandBar();
            });

            let filterValue = this.stateService.getFilter();
            this.totalSandboxes = sandboxMenuItems.length;
            this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, filterValue);
            this.filter.setValue(filterValue);
            this.filter.valueChanges.pipe
            (
                debounceTime(300),
                distinctUntilChanged(),
            )
                .subscribe(value => {
                    this.stateService.setFilter(value);
                    this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, value);
                    if (!value) {
                        this.selectScenario(null, null);
                    }
                });
        }

        // expose select scenario functionality for visual regression test
        (window as any).loadScenario = (sandboxKey: string, scenarioKey: number) => {
            this.selectScenario(sandboxKey, scenarioKey);
            this.changeDetectorRef.detectChanges();
        };

        // set flag to check when component is loaded
        (window as any).isPlaygroundComponentLoaded = () => false;
        (window as any).isPlaygroundComponentLoadedWithErrors = () => false;
    }

    onFilterBoxArrowDown(event: any, switchToScenario = false) {
        event.preventDefault();
        let elementRef;
        const currentIndex = this.findCurrentScenarioIndex();

        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex + 1);
        } else {
            elementRef = this.focusScenarioLinkElement(0);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    }

    onFilterBoxArrowUp(event: any, switchToScenario = false) {
        event.preventDefault();
        let elementRef;
        const currentIndex = this.findCurrentScenarioIndex();

        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex - 1);
        } else if (this.scenarioLinkElements.length > 0) {
            elementRef = this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
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

    onScenarioLinkControlDown(scenarioElement: any, event: any) {
        if (!this.commandBarActive) return;
        event.preventDefault();
        let elementRef = this.goDown(scenarioElement);
        this.showScenario(elementRef);
    }

    onScenarioLinkControlUp(scenarioElement: any, event: any) {
        if (!this.commandBarActive) return;
        event.preventDefault();
        let elementRef = this.goUp(scenarioElement);
        this.showScenario(elementRef);
    }

    onCommandBarStartPreview(event: any) {
        event.preventDefault();
        this.commandBarPreview = true;
    }

    onCommandBarStopPreview() {
        this.commandBarPreview = false;
    }

    onScenarioClick(sandboxKey: string, scenarioKey: number, event: any) {
        event.preventDefault();
        this.selectScenario(sandboxKey, scenarioKey);
    }

    isSelected(sandbox: any, scenario: any) {
        return this.selectedSandboxAndScenarioKeys.scenarioKey === scenario.key
            && this.selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase() === sandbox.key.toLowerCase();
    }

    toggleCommandBar() {
        this.commandBarActive = !this.commandBarActive;
    }

    private blockEvent(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    private showScenario(selectedScenarioElementRef: ElementRef) {
        if (selectedScenarioElementRef) {
            this.selectScenario(
                selectedScenarioElementRef.nativeElement.getAttribute('sandboxMenuItemKey'),
                parseInt(selectedScenarioElementRef.nativeElement.getAttribute('scenarioMenuItemkey'), 10));
        }
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
            return this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        } else {
            return this.focusScenarioLinkElement(currentIndex - 1);
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
            return this.focusScenarioLinkElement(0);
        } else {
            return this.focusScenarioLinkElement(currentIndex + 1);
        }
    }

    private focusScenarioLinkElement(index: number) {
        if (this.scenarioLinkElements.toArray()[index]) {
            let elementRef = this.scenarioLinkElements.toArray()[index];
            elementRef.nativeElement.focus();
            return elementRef;
        }
    }

    private filterSandboxes(sandboxMenuItems: SandboxMenuItem[], filter: string) {
        if (!filter) {
            return sandboxMenuItems.map((item, i) => Object.assign({}, item, {tabIndex: i}));
        }

        let tabIndex = 0;
        let filterNormalized = filter.toLowerCase();

        return sandboxMenuItems
            .reduce((accum, curr) => {
                let searchKeyNormalized = curr.searchKey.toLowerCase();
                let indexMatches = fuzzySearch(filterNormalized, searchKeyNormalized);
                if (indexMatches) {
                    let weight = this.levenshteinDistance.getDistance(filterNormalized, searchKeyNormalized);
                    return [...accum, Object.assign({}, curr, {weight, indexMatches})];
                } else {
                    return accum;
                }
            }, [])
            .sort((a, b) => {
                return a.weight - b.weight;
            })
            .map(sandboxMenuItem => Object.assign({}, sandboxMenuItem, {tabIndex: tabIndex++}));
    }

    private selectScenario(sandboxKey: string, scenarioKey: number) {
        // set flag to check when component is loaded
        (window as any).isPlaygroundComponentLoaded = () => false;
        (window as any).isPlaygroundComponentLoadedWithErrors = () => false;
        this.selectedSandboxAndScenarioKeys = {sandboxKey, scenarioKey};
        this.urlService.setSelected(sandboxKey, scenarioKey);
    }

    private getShortcuts() {
        return [
            {
                keys: ['ctrl + p', 'f2'],
                description: 'Toggle command bar open/closed',
            },
            {
                keys: ['esc'],
                description: 'Close command bar',
            },
            {
                keys: ['\u2191', '\u2193'],
                description: 'Navigate up or down in command bar list',
            },
            {
                keys: ['ctrl + \u2191', 'ctrl + \u2193'],
                description: 'Switch scenarios while navigating up or down in command bar list',
            },
        ];
    }
}
