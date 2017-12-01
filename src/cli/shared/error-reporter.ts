import * as fs from 'fs';
import { BambooResults, BambooStats } from './bamboo-reporter';
import { ScenarioSummary } from '../verify-sandboxes';

export enum ReportType {
    Log,
    Bamboo
}

export class ErrorReporter {
    private _errors: { descriptions: any, scenario: string }[] = [];

    constructor(
        public scenarios: ScenarioSummary[],
        public type = ReportType.Log,
        public filename: string
    ) {}

    get errors() {
        return this._errors;
    }

    redWrap(msg: string): string {
        return `\x1b[31m${msg}\x1b[0m`;
    }

    addError(descriptions: any, scenario: string) {
        this._errors.push({ descriptions, scenario });
    }

    compileReport() {
        switch (this.type) {
            case ReportType.Log:
                console.error(`${this.redWrap('ERROR:')} in the following scenarios`);
                this._errors.forEach(e => {
                    console.log(e.scenario);
                    console.log(e.descriptions);
                });
                break;
            case ReportType.Bamboo:
                const stats = new BambooStats(this.scenarios.length, this.errors.length);
                const result = new BambooResults(
                    stats,
                    this.errors,
                    this.scenarios.map(s => `${s.name}: ${s.description}`),
                    []);
                fs.writeFileSync(this.filename, result.getJson());
                break;
        }
    }

}
