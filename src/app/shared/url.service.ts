export class UrlService {
  private _sandbox;
  private _scenario;

  get sandbox() {
    return this._sandbox;
  }

  get scenario() {
    return this._scenario;
  }

  constructor() {
    let match = /\?embed=([^&#]*)/g.exec(window.location.href);
    if (match !== null) {
      let embed = decodeURIComponent(match[1]);
      let firstSlash = embed.indexOf('/');
      this._sandbox = embed.substr(0, firstSlash);
      this._scenario = embed.substr(firstSlash+1, embed.length);
    }
  }
}
