import { SandboxMenuItem } from '../../lib/app-state';
import { getSandbox, getSandboxMenuItems } from './sandboxes';

export class LoaderService {
    static loadSandbox(path: string): any {
        return getSandbox(path);
    }

    static getSandboxMenuItems(): SandboxMenuItem[] {
        return getSandboxMenuItems();
    }
}
