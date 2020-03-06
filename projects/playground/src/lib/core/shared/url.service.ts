import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SandboxMenuItem } from '../../lib/app-state';
import { SandboxLoader } from './sandbox-loader';

@Injectable()
export class UrlService {
    private _embed: boolean = null;
    private _select: any = null;

    sandboxMenuItems: SandboxMenuItem[];

    get embed() {
        return this._embed;
    }

    get select() {
        return this._select;
    }

    constructor(private location: Location) {
        this.sandboxMenuItems = SandboxLoader.getSandboxMenuItems();
        const urlPath = location.path();
        this._embed = /[?|&]embed=1/.exec(urlPath) !== null;
        this._select = this.parse('scenario', this.sandboxMenuItems, urlPath);
        if (this._select) {
            if (this._select.sandboxKey === null && this._select.scenarioKey === null) {
                this.location.replaceState('');
                return;
            }
        }
    }

    setSelected(sandboxKey: string, scenarioKey: number) {
        if (sandboxKey === null && scenarioKey === null) {
            this.location.replaceState('');
            return;
        }
        const sandBoxMenuItem = this.sandboxMenuItems
            .find(sandboxMenuItem => sandboxMenuItem.key.toLowerCase() === sandboxKey.toLowerCase());
        const scenarioMenuItem = sandBoxMenuItem.scenarioMenuItems.find(mi => mi.key === scenarioKey);
        const key = sandBoxMenuItem.uniqueId ? sandBoxMenuItem.uniqueId : sandboxKey;
        this.location.replaceState(`?scenario=${encodeURIComponent(key)}/${encodeURIComponent(scenarioMenuItem.description)}`);
    }

    private parse(key: string, sandboxMenuItems: SandboxMenuItem[], urlPath: string) {
        const match = new RegExp('[?|&]' + key + '=([^&#]*)').exec(urlPath);
        if (match !== null) {
            const value = match[1];
            const firstSlash = value.indexOf('/');

            const sbKey = value.substr(0, firstSlash);
            let sandboxKey = decodeURIComponent(sbKey);
            const sandboxMenuItem = sandboxMenuItems
                .find(smi => smi.key.toLowerCase() === sandboxKey.toLowerCase()
                    || (smi.uniqueId && smi.uniqueId === sandboxKey));
            sandboxKey = sandboxMenuItem.key;
            if (!sandboxMenuItem) {
                return { sandboxKey: null, scenarioKey: null };
            }
            const scenarioDesc = decodeURIComponent(value.substr(firstSlash + 1, value.length).toLowerCase());
            const scenarioKey = sandboxMenuItem.scenarioMenuItems
                .findIndex(scenarioMenuItem => scenarioMenuItem.description.toLowerCase() === scenarioDesc) + 1;
            if (scenarioKey <= 0) {
                return { sandboxKey: null, scenarioKey: null };
            }

            return { sandboxKey, scenarioKey };
        }
    }
}
