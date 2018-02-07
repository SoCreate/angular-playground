import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PlaygroundCommonModule } from './playground-common.module';

declare let require: any;

@NgModule({
    imports: [
        BrowserModule,
        PlaygroundCommonModule
    ],
    bootstrap: [AppComponent]
})
export class PlaygroundModule {
}
