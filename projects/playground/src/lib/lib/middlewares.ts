import { InjectionToken, Type } from '@angular/core';
import { Sandboxes } from "../core/shared/sandboxes";

export interface Configuration {
    selector?: string;
    modules?: any[];
    overlay?: boolean;
    sandboxesDefined: Type<Sandboxes>;
}

export interface Middleware {
    selector?: string;
    modules?: any[];
    overlay?: boolean;
}

export const MIDDLEWARE = new InjectionToken('middleware');
