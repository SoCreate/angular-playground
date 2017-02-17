import {Injectable, Inject} from '@angular/core';
import {Location} from '@angular/common';
import {SANDBOXES} from './tokens';
import {Sandbox} from './app-state';

@Injectable()
export class UrlService {
  private _embed = null;
  private _select = null;

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
  }

  setSelected(sandboxKey, scenarioKey) {
    if (sandboxKey === null && scenarioKey === null) {
      this.location.replaceState('');
      return;
    }
    let scenarioDescription = this.sandboxes
      .find(sandbox => sandbox.key.toLowerCase() === sandboxKey.toLowerCase())
      .scenarios.find(scenario => scenario.key === scenarioKey).description;
    this.location.replaceState(`?scenario=${encodeURIComponent(sandboxKey)}/${encodeURIComponent(scenarioDescription)}`);
  }

  private parse(key, sandboxes, urlPath) {
    let match = new RegExp('[?|&]' + key + '=([^&#]*)').exec(urlPath);
    if (match !== null) {
      let value = decodeURIComponent(match[1]);
      let firstSlash = value.indexOf('/');

      let filter = value.substr(0, firstSlash);
      let sandboxKey = filter;
      let scenarioKey = sandboxes
          .find(sandbox => sandbox.key.toLowerCase() === sandboxKey.toLowerCase())
          .scenarios.findIndex(scenario => scenario.description.toLowerCase() === value.substr(firstSlash + 1, value.length).toLowerCase()) + 1;

      return {filter, sandboxKey, scenarioKey};
    }
  }
}
