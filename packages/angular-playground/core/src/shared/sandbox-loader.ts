import { SandboxMenuItem } from '../../lib/app-state';
import { getSandbox, getSandboxMenuItems } from './sandboxes';

export class SandboxLoader {
    static loadSandbox(path: string): any {
        return getSandbox(path);
    }

    static getSandboxMenuItems(): SandboxMenuItem[] {
        return getSandboxMenuItems();
    }
}
