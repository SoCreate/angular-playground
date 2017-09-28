import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground } from 'angular-playground';
import { MyPlaygroundModule } from './my-playground.module';

initializePlayground('ng-app');
platformBrowserDynamic().bootstrapModule(MyPlaygroundModule);
