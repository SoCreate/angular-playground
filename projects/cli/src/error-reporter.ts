import { writeFileSync } from 'fs';
import { ScenarioSummary } from './check-errors/verify-sandboxes';
import { JSONReporter } from './check-errors/reporters/json-reporter';
import { XMLReporter } from './check-errors/reporters/xml-reporter';
const chalk = require('chalk');

export const REPORT_TYPE = {
    LOG: 'log',
    JSON: 'json',
    XML: 'xml',
};

export interface Reporter {
    getReport: () => string;
}

export interface ErrorReport {
    descriptions: any;
    scenario: string;
    scenarioTitle: string;
}

export class ErrorReporter {
    private _errors: ErrorReport[] = [];

    constructor(
        public scenarios: ScenarioSummary[],
        public filename: string,
        public type: string) {}

    get errors() {
        return this._errors;
    }

    addError(descriptions: any, scenario: string, scenarioTitle: string) {
        this._errors.push({ descriptions, scenario, scenarioTitle });
    }

    compileReport() {
        let reporter: Reporter;
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
                reporter = new JSONReporter(this.errors, scenarioNames);
                writeFileSync(this.filename, reporter.getReport());
                break;
            case REPORT_TYPE.XML:
                reporter = new XMLReporter(this.errors, this.scenarios);
                writeFileSync(this.filename, reporter.getReport());
                break;
        }
    }
}
