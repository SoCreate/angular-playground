import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PlaygroundCommonModule } from './playground-common.module';
import { Middleware, MIDDLEWARE } from '../lib/middlewares';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { initializePlayground } from '../lib/initialize-playground';

declare let require: any;

const _middleware = new BehaviorSubject<Middleware>({
    selector: null,
    modules: [],
    overlay: false
});
const middleware = _middleware.asObservable();

@NgModule({
    imports: [
        BrowserModule,
        PlaygroundCommonModule
    ],
    providers: [
        { provide: MIDDLEWARE, useValue: middleware }
    ],
    bootstrap: [AppComponent]
})
export class PlaygroundModule {
    static configure(configuration: Middleware) {
        if (!configuration.selector) {
            throw new Error('Please provide the selector for the application you would like Playground to bootstrap.');
        }

        initializePlayground(configuration.selector);
        _middleware.next(configuration);

        return this;
    }
}
