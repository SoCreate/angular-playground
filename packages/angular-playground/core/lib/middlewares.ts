import { InjectionToken } from '@angular/core';

export interface Middleware {
    modules?: any[];
    hostComponent?: any;
    uiActive: boolean;
}

export const MIDDLEWARE = new InjectionToken('middleware');
