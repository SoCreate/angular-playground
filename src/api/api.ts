export interface SandboxOfConfig {
  prependText?: string;
  imports?: any[];
  declarations?: any[];
  providers?: any[];
  declareComponent?: boolean;
}

export interface ScenarioConfig {
  template: string;
  styles?: string[];
  context?: any;
  providers?: any[];
}

export function sandboxOf(type: any, config?: SandboxOfConfig): SandboxBuilder {
  return new SandboxBuilder(type, config);
}

export class SandboxBuilder {
  private _prependTextAsKey: string;
  private _scenarios: any[] = [];
  private _scenarioCounter = 0;

  constructor(private _type: any,
              private _config: SandboxOfConfig = {}) {
    this._prependTextAsKey = this._config.prependText || '';
  }

  add(description: string, config: ScenarioConfig) {
    let key = ++this._scenarioCounter;
    this._scenarios.push(Object.assign({}, config, {key, description}));
    return this;
  }

  serialize(typeName: string) {
    return {
      key: `${this._prependTextAsKey}${typeName}`,
      name: typeName,
      type: this._type,
      scenarios: this._scenarios,
      prependText: this._config.prependText || '',
      imports: this._config.imports || null,
      declarations: this._config.declarations || null,
      providers: this._config.providers || null,
      declareComponent: this._config.declareComponent !== undefined ? this._config.declareComponent : true,
    };
  }
}
