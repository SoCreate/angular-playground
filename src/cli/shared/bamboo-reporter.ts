export class BambooStats {
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

export class BambooResults {
    constructor(
        public stats: BambooStats,
        public failures: any[],
        public passes: any[],
        public skips: any[]
    ) {}

    getJson() {
        return JSON.stringify({
            stats: this.stats,
            failures: this.failures,
            passes: this.passes,
            skips: this.skips
        }, null, 2);
    }
}
