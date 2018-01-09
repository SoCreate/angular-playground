import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SandboxMenuItem } from '../lib/app-state';
import { LoaderService } from './loader.service';

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

  constructor(private loaderService: LoaderService,
              private location: Location) {
    this.sandboxMenuItems = this.loaderService.getSandboxMenuItems();
    let urlPath = location.path();
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
    let scenarioDescription = this.sandboxMenuItems
      .find(sandboxMenuItem => sandboxMenuItem.key.toLowerCase() === sandboxKey.toLowerCase())
      .scenarioMenuItems.find(scenarioMenuItem => scenarioMenuItem.key === scenarioKey).description;
    this.location.replaceState(`?scenario=${encodeURIComponent(sandboxKey)}/${encodeURIComponent(scenarioDescription)}`);
  }

  private parse(key: string, sandboxMenuItems: SandboxMenuItem[], urlPath: string) {
    let match = new RegExp('[?|&]' + key + '=([^&#]*)').exec(urlPath);
    if (match !== null) {
      let value = match[1];
      let firstSlash = value.indexOf('/');

      let sbKey = value.substr(0, firstSlash);
      let sandboxKey = decodeURIComponent(sbKey);
      let sandboxMenuItem = sandboxMenuItems
        .find(smi => smi.key.toLowerCase() === sandboxKey.toLowerCase());
      if (!sandboxMenuItem) {
        return {sandboxKey: null, scenarioKey: null};
      }
      let scenarioDesc = decodeURIComponent(value.substr(firstSlash + 1, value.length).toLowerCase());
      let scenarioKey = sandboxMenuItem.scenarioMenuItems
          .findIndex(scenarioMenuItem => scenarioMenuItem.description.toLowerCase() === scenarioDesc) + 1;
      if (scenarioKey <= 0) {
        return {sandboxKey: null, scenarioKey: null};
      }

      return {sandboxKey, scenarioKey};
    }
  }
}
