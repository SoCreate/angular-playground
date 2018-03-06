import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PlaygroundCommonModule } from './playground-common.module';
import { Middleware, MIDDLEWARE } from '../lib/middlewares';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare let require: any;

const _middleware = new BehaviorSubject<Middleware>({
    modules: []
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
    static registerRootModules(...modules) {
        _middleware.next({
            modules
        });
    }

    static applyMiddleware() {
        // TODO
    }
}
