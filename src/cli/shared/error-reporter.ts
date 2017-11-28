export enum ReportType {
    Log
}

export class ErrorReporter {
    private _errors: { error: any, scenario: string }[] = [];

    constructor(public type = ReportType.Log) {}

    get errors() {
        return this._errors;
    }

    addError(error: any, scenario: string) {
        this._errors.push({ error, scenario });
    }

    compileReport() {
        switch (this.type) {
            case ReportType.Log:
                console.log('Found errors in the following scenarios:');
                this._errors.forEach(e => console.log(e.scenario));
        }
    }

}
