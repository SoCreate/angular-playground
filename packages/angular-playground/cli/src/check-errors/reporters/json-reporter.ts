import { Reporter } from '../../error-reporter';

class JSONStats {
    suites = 1;
    passes: number;
    pending = 0;
    duration = 0;
    time = 0;

    constructor(
        public tests: number,
        public failures: number,
        public start = 0,
        public end = 0
    ) {
        this.passes = this.tests - this.failures;
    }

}

export class JSONReporter implements Reporter {
    constructor (
        public errors: any[],
        public scenarioNames: string[]
    ) {}

    getReport() {
        return JSON.stringify({
            stats: new JSONStats(this.scenarioNames.length, this.errors.length),
            failures: this.errors.map(failure => {
                if (!failure) return;
                return {
                    title: failure.scenario,
                    err: {
                        message: failure.descriptions[0]
                    }
                };
            }),
            passes: this.scenarioNames.map(pass => {
                return { title: pass };
            }),
            skips: []
        }, null, 2);
    }
}
