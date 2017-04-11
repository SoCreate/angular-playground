import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SANDBOXES } from './tokens';
import { Sandbox } from './app-state';

@Injectable()
export class UrlService {
  private _embed: boolean = null;
  private _select: any = null;

  get embed() {
    return this._embed;
  }

  get select() {
    return this._select;
  }

  constructor(@Inject(SANDBOXES) private sandboxes: Sandbox[],
              private location: Location) {
    let urlPath = location.path();
    this._embed = /[?|&]embed=1/.exec(urlPath) !== null;
    this._select = this.parse('scenario', sandboxes, urlPath);
    if (this._select) {
      this.replaceStateIfNull(this._select.sandboxKey, this._select.scenarioKey);
    }
  }

  setSelected(sandboxKey: string, scenarioKey: number) {
    this.replaceStateIfNull(sandboxKey, scenarioKey);
    let scenarioDescription = this.sandboxes
      .find(sandbox => sandbox.key.toLowerCase() === sandboxKey.toLowerCase())
      .scenarios.find(scenario => scenario.key === scenarioKey).description;
    this.location.replaceState(`?scenario=${encodeURIComponent(sandboxKey)}/${encodeURIComponent(scenarioDescription)}`);
  }

  private replaceStateIfNull(sandboxKey: string, scenarioKey: number) {
    if (sandboxKey === null && scenarioKey === null) {
      this.location.replaceState('');
      return;
    }
  }

  private parse(key: string, sandboxes: Sandbox[], urlPath: string) {
    let match = new RegExp('[?|&]' + key + '=([^&#]*)').exec(urlPath);
    if (match !== null) {
      let value = decodeURIComponent(match[1]);
      let firstSlash = value.indexOf('/');

      let filter = value.substr(0, firstSlash);
      let sandboxKey = filter;
      let sandbox = sandboxes
        .find(sandbox => sandbox.key.toLowerCase() === sandboxKey.toLowerCase());
      if (!sandbox) {
        return {filter, sandboxKey: null, scenarioKey: null};
      }
      let scenarioKey = sandbox.scenarios
          .findIndex(scenario => scenario.description.toLowerCase() === value.substr(firstSlash + 1, value.length).toLowerCase()) + 1;
      if (scenarioKey <= 0) {
        return {filter, sandboxKey: null, scenarioKey: null};
      }

      return {filter, sandboxKey, scenarioKey};
    }
  }
}
