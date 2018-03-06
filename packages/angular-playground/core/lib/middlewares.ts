import { InjectionToken } from '@angular/core';

export interface Middleware {
    modules?: any[];
    hostComponent?: any;
}

export const MIDDLEWARE = new InjectionToken('middleware');
