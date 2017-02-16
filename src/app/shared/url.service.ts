import {Injectable, Inject} from "@angular/core";
import {SANDBOXES} from "./tokens";
import {Sandbox} from "./app-state";

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

  constructor(@Inject(SANDBOXES) sandboxes: Sandbox[]) {
    this._embed = this.parse('embed', sandboxes);
    this._select = this.parse('select', sandboxes);
    if (this._select) {
      window.location.href.replace(window.location.search, '');
    }
  }

  private parse(key, sandboxes) {
    let match = new RegExp('\\?' + key + '=([^&#]*)').exec(window.location.href);
    if (match !== null) {
      let value = decodeURIComponent(match[1]);
      let firstSlash = value.indexOf('/');

      let sandboxKey = `${value.substr(0, firstSlash)}Component`;
      let scenarioKey = sandboxes
          .find(sandbox => sandbox.key.toLowerCase() === sandboxKey.toLowerCase())
          .scenarios.findIndex(scenario => scenario.description.toLowerCase() === value.substr(firstSlash + 1, value.length).toLowerCase()) + 1;

      return { sandboxKey, scenarioKey };
    }
  }
}
