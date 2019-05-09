import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PlaygroundCommonModule } from './playground-common.module';
import { Middleware, MIDDLEWARE } from '../lib/middlewares';
import { initializePlayground } from '../lib/initialize-playground';
import { BehaviorSubject } from 'rxjs';

declare let require: any;

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
        { provide: MIDDLEWARE, useValue: middleware },
    ],
    bootstrap: [AppComponent],
})
export class PlaygroundModule {
    static configure(configuration: Middleware) {
        initializePlayground(configuration.selector);
        _middleware.next({ ..._middleware.value, ...configuration });
        return this;
    }
}
