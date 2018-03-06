import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground, PlaygroundModule } from 'angular-playground';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

initializePlayground('app-root');

enableProdMode();

PlaygroundModule.registerRootModules(
  BrowserAnimationsModule,
  environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
);

platformBrowserDynamic().bootstrapModule(PlaygroundModule)
  .catch(err => console.error(err));
