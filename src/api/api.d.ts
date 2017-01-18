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
export declare function sandboxOf(type: any, config?: SandboxOfConfig): SandboxBuilder;
export declare class SandboxBuilder {
    private _type;
    private _config;
    private _key;
    private _scenarios;
    private _scenarioCounter;
    constructor(_type: any, _config?: SandboxOfConfig);
    add(description: string, config: ScenarioConfig): this;
    serialize(): {
        key: any;
        name: any;
        type: any;
        scenarios: any[];
        prependText: string;
        imports: any[];
        declarations: any[];
        providers: any[];
    };
}
