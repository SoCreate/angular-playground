export interface SandboxOfConfig {
  prependText?: string;
  imports?: any[];
  declarations?: any[];
  providers?: any[];
}

export interface ScenarioConfig {
  template: string;
  description?: string;
  styles?: string[];
  context?: any;
  providers?: any[];
}

export function sandboxOf(type: any, config?: SandboxOfConfig): SandboxBuilder {
  return new SandboxBuilder(type, config);
}

export class SandboxBuilder {
  private _key;
  private _scenarios = [];
  private _scenarioCounter = 0;

  constructor(private _type: any,
              private _config: SandboxOfConfig = {}) {
    let prependTextAsKey = this._config.prependText ? this._config.prependText.replace(/ /g, '') : '';
    this._key = `${prependTextAsKey}${this._type.name}`;
  }

  add(description: string, config: ScenarioConfig) {
    let key = `${++this._scenarioCounter}`;
    this._scenarios.push(Object.assign({}, config, {key, description}));
    return this;
  }

  serialize() {
    return {
      key: this._key,
      name: this._type.name.replace(/Component$/, ''),
      type: this._type,
      scenarios: this._scenarios,
      prependText: this._config.prependText,
      imports: this._config.imports,
      declarations: this._config.declarations,
      providers: this._config.providers
    };
  }
}
