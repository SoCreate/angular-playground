import { InjectionToken, Type } from '@angular/core';
import { Sandboxes } from "../core/shared/sandboxes";
import { Observable } from 'rxjs';

export interface Configuration {
    selector?: string;
    modules?: any[];
    overlay?: boolean;
    sandboxesDefined: Type<Sandboxes>;
    htmlTitle?: string;
}

export interface Middleware {
    selector?: string;
    modules?: any[];
    overlay?: boolean;
}

export const MIDDLEWARE = new InjectionToken<Observable<Middleware>>('middleware');
