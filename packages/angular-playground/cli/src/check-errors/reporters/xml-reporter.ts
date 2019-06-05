import { ErrorReport, Reporter } from '../../error-reporter';
import { ScenarioSummary } from '../verify-sandboxes';

export class XMLReporter implements Reporter {
    constructor (
        public errors: ErrorReport[],
        public scenarios: ScenarioSummary[]) {}

    getReport() {
        let result = `<testsuite name="Check Sandbox Errors" tests="${this.scenarios.length}" failures="${this.errors.length}" skipped="0">\n`;
        for (const scenario of this.scenarios) {
            const name = this.htmlEncode(scenario.name);
            const description = this.htmlEncode(scenario.description);
            result += `<testcase classname="${name}" name="${description}">\n`;
            const failure = this.errors.find(error =>
                error.scenario === scenario.name && error.scenarioTitle === scenario.description);
            if (failure) {
                const message = this.htmlEncode(failure.descriptions[0]);
                result += `<failure message="Scenario Failed">${message}</failure>\n`;
            }
            result += '</testcase>\n';
        }
        result += '</testsuite>\n';
        return result;
    }

    private htmlEncode(s: string) {
        if (!s) {
            return '';
        }
        return s
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
