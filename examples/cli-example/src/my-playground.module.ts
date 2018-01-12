import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, PlaygroundCommonModule } from 'angular-playground';
import { environment } from './environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PlaygroundCommonModule,
    environment.production
      ? ServiceWorkerModule.register('/ngsw-worker.js')
      : []
  ],
  bootstrap: [AppComponent]
})
export class MyPlaygroundModule {}
