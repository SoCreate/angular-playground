import { NgModule } from '@angular/core';
import { ScenarioComponent } from './scenario/scenario.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SANDBOXES } from './shared/tokens';
import { StateService } from './shared/state.service';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: SANDBOXES, useFactory: loadSandboxes},
    StateService
  ],
  declarations: [AppComponent, ScenarioComponent],
  bootstrap: [AppComponent]
})
export class PlaygroundModule {
}

export function loadSandboxes() {
  return require('sandboxes').default;
}
