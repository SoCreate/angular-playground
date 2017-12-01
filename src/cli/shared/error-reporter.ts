export enum ReportType {
    Log
}

export class ErrorReporter {
    private _errors: { descriptions: any, scenario: string }[] = [];

    constructor(public type = ReportType.Log) {}

    get errors() {
        return this._errors;
    }

    addError(descriptions: any, scenario: string) {
        this._errors.push({ descriptions, scenario });
    }

    compileReport() {
        switch (this.type) {
            case ReportType.Log:
                console.error(`\x1b[31mERROR Found\x1b[0m in the following scenarios:`);
                this._errors.forEach(e => {
                    console.log(e.scenario);
                    console.log(e.descriptions);
                });
        }
    }

}
