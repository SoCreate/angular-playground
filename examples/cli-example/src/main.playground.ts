import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PlaygroundModule } from 'angular-playground';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from './environments/environment';
import { Component, enableProdMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

enableProdMode();

PlaygroundModule
  .configure({
    selector: 'app-root',
    overlay: true,
    modules: [
      BrowserAnimationsModule,
      environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
    ]
  });

@Component({
  selector: 'playground-app',
  template: '<playground-root></playground-root>'
})
export class AppComponent {
}

@NgModule({
  imports: [
    BrowserModule,
    PlaygroundModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
