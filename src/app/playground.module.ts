import {NgModule} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {ScenarioComponent} from './scenario/scenario.component';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {SANDBOXES} from './shared/tokens';
import {StateService} from './shared/state.service';
import {loadSandboxes} from './load-sandboxes';
import {FocusDirective} from "./shared/focus.directive";
import {UrlService} from "./shared/url.service";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [
    Location,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: SANDBOXES, useFactory: loadSandboxes},
    StateService,
    UrlService
  ],
  declarations: [AppComponent, ScenarioComponent, FocusDirective],
  bootstrap: [AppComponent]
})
export class PlaygroundModule {
}
