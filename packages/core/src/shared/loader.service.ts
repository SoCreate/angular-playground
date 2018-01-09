import { Injectable } from '@angular/core';
import { SandboxMenuItem } from '../lib/app-state';
import { getSandbox, getSandboxMenuItems } from './sandboxes';

@Injectable()
export class LoaderService {
    loadSandbox(path: string): any {
        return getSandbox(path);
    }

    getSandboxMenuItems(): SandboxMenuItem[] {
        return getSandboxMenuItems();
    }
}
