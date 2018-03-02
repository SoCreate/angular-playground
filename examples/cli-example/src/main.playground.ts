import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground, PlaygroundModule } from 'angular-playground';
import { MyPlaygroundModule } from './my-playground.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleWithProviders } from '@angular/core';

initializePlayground('app-root');
// platformBrowserDynamic().bootstrapModule(MyPlaygroundModule);

PlaygroundModule.applyMiddleware(BrowserAnimationsModule);
platformBrowserDynamic().bootstrapModule(PlaygroundModule);

// platformBrowserDynamic().bootstrapModule(playgroundWithMiddleware)
//   .catch(err => console.error(err));
