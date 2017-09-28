import { NgModule } from '@angular/core';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScenarioComponent } from './scenario/scenario.component';
import { SANDBOX_LOADER, SANDBOX_MENU_ITEMS } from './shared/tokens';
import { StateService } from './shared/state.service';
import { loadSandboxMenuItems, sandboxLoaderFactory } from './load-sandboxes';
import { FocusDirective } from './shared/focus.directive';
import { UrlService } from './shared/url.service';
import { AppComponent } from './app.component';

declare let require: any;

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    Location,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: SANDBOX_MENU_ITEMS, useFactory: loadSandboxMenuItems},
    {provide: SANDBOX_LOADER, useFactory: sandboxLoaderFactory},
    StateService,
    UrlService
  ],
  declarations: [AppComponent, ScenarioComponent, FocusDirective],
  exports: [AppComponent]
})
export class PlaygroundCommonModule {
}
