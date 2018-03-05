import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground, PlaygroundModule } from 'angular-playground';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

initializePlayground('app-root');

PlaygroundModule.registerRootModules(BrowserAnimationsModule);

platformBrowserDynamic().bootstrapModule(PlaygroundModule)
  .catch(err => console.error(err));
