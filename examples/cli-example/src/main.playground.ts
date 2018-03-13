import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PlaygroundModule } from 'angular-playground';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

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

platformBrowserDynamic().bootstrapModule(PlaygroundModule)
  .catch(err => console.error(err));
