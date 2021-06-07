import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PlaygroundModule } from 'angular-playground';
import { SandboxesDefined } from './sandboxes';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

platformBrowserDynamic().bootstrapModule(PlaygroundModule
  .configure({
    selector: 'app-root',
    overlay: true,
    modules: [
      BrowserAnimationsModule
    ],
    sandboxesDefined: SandboxesDefined
  }))
  .catch(err => console.error(err));
