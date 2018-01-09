import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { ScenarioSummary } from './verify-sandboxes';
import { JSONReporter } from './reporters/json-reporter';

export const REPORT_TYPE = {
    LOG: 'log',
    JSON: 'json'
};

export class ErrorReporter {
    private _errors: { descriptions: any, scenario: string }[] = [];

    constructor(
        public scenarios: ScenarioSummary[],
        public filename: string,
        public type: string
    ) {}

    get errors() {
        return this._errors;
    }

    addError(descriptions: any, scenario: string) {
        this._errors.push({ descriptions, scenario });
    }

    compileReport() {
        switch (this.type) {
            case REPORT_TYPE.LOG:
                console.error(chalk.red('Error in the following scenarios'));
                this._errors.forEach(e => {
                    console.log(e.scenario);
                    console.log(e.descriptions);
                });
                break;
            case REPORT_TYPE.JSON:
                const scenarioNames = this.scenarios.map(s => `${s.name}: ${s.description}`);
                const results = new JSONReporter(this.errors, scenarioNames);
                writeFileSync(this.filename, results.getJson());
                break;
        }
    }

}
