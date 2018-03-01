import { Sandbox } from './app-state';

export interface SandboxOfConfig {
    label?: string;
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
    private _scenarios: any[] = [];
    private _scenarioCounter = 0;

    constructor(private _type: any,
        private _config: SandboxOfConfig = {}) {
    }

    add(description: string, config: ScenarioConfig) {
        let key = ++this._scenarioCounter;
        this._scenarios.push(Object.assign({}, config, { key }));
        return this;
    }

    serialize(sandboxPath: string): Sandbox {
        return {
            key: sandboxPath,
            type: this._type,
            scenarios: this._scenarios,
            imports: this._config.imports || [],
            declarations: this._config.declarations || [],
            providers: this._config.providers || [],
            declareComponent: this._config.declareComponent !== undefined ? this._config.declareComponent : true,
        };
    }
}
