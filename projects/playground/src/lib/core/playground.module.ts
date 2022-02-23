import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlaygroundCommonModule } from './playground-common.module';
import { Configuration, Middleware, MIDDLEWARE } from '../lib/middlewares';
import { initializePlayground } from '../lib/initialize-playground';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from "./app.component";
import { Sandboxes } from "./shared/sandboxes";

const sandboxDefinitions = {
    getSandbox: (path: string) => { },
    getSandboxMenuItems: () => { }
};

const _middleware = new BehaviorSubject<Middleware>({
    selector: null,
    overlay: false,
    modules: [],
});
const middleware = _middleware.asObservable();


@NgModule({
    imports: [
        BrowserModule,
        PlaygroundCommonModule,
    ],
    providers: [
        {provide: MIDDLEWARE, useValue: middleware},
        {provide: Sandboxes, useValue: sandboxDefinitions}
    ],
    bootstrap: [AppComponent]
})
export class PlaygroundModule {
    private static setSandboxDefinitions(sandboxesDefinedType: Type<Sandboxes>) {
        const s = new sandboxesDefinedType();
        sandboxDefinitions.getSandbox = s.getSandbox;
        sandboxDefinitions.getSandboxMenuItems = s.getSandboxMenuItems;
    }

    static configure(configuration: Configuration) {
        PlaygroundModule.setSandboxDefinitions(configuration.sandboxesDefined);
        initializePlayground(configuration.selector, configuration.htmlTitle);
        _middleware.next({..._middleware.value, ...configuration});
        return this;
    }
}
