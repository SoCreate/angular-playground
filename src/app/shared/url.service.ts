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

  constructor(@Inject(SANDBOXES) sandboxes: Sandbox[],
              location: Location) {
    let urlPath = location.path();
    this._embed = this.parse('embed', sandboxes, urlPath);
    this._select = this.parse('select', sandboxes, urlPath);
    if (this._select) {
      location.replaceState('');
    }
  }

  private parse(key, sandboxes, urlPath) {
    let match = new RegExp('\\?' + key + '=([^&#]*)').exec(urlPath);
    if (match !== null) {
      let value = decodeURIComponent(match[1]);
      let firstSlash = value.indexOf('/');

      let filter = value.substr(0, firstSlash);
      let sandboxKey = `${filter}Component`;
      let scenarioKey = sandboxes
          .find(sandbox => sandbox.key.toLowerCase() === sandboxKey.toLowerCase())
          .scenarios.findIndex(scenario => scenario.description.toLowerCase() === value.substr(firstSlash + 1, value.length).toLowerCase()) + 1;

      return {filter, sandboxKey, scenarioKey};
    }
  }
}
