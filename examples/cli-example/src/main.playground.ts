import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground, PlaygroundModule } from 'angular-playground';
import { MyPlaygroundModule } from './my-playground.module';

initializePlayground('app-root');
platformBrowserDynamic().bootstrapModule(MyPlaygroundModule);
