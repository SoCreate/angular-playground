class Flag {
    constructor(
        public aliases: string[],
        public value: any,
        public required = false
    ) {}
}
interface Flags {
    [key: string]: Flag;
}

/**
 * Configuration object used to parse and assign command line arguments
 */
export class Configuration {
    flags: Flags = {
        noWatch: new Flag(['--no-watch'], false),
        noServe: new Flag(['--no-serve'], false),
        checkErrors: new Flag(['--check-errors'], false),
        randomScenario: new Flag(['--random-scenario'], false),
        sourceRoot: new Flag(['--src', '-S'], null, true),
        config: new Flag(['--config', '-C'], 'angular-playground.json'),
        timeout: new Flag(['--timeout'], 90),
        ngCliApp: new Flag(['--ng-cli-app'], 'playground'),
        ngCliEnv: new Flag(['--ng-cli-env'], null),
        ngCliPort: new Flag(['--ng-cli-port'], 4201),
        ngCliCmdPath: new Flag(['--ng-cli-cmd'], 'node_modules/@angular/cli/bin/ng')
    };

    // Used to tailor the version of headless chromium ran by puppeteer
    chromeArguments = [ '--disable-gpu', '--no-sandbox' ];

    constructor(rawArgv: string[]) {
        // Apply command line arguments
        rawArgv.forEach((argv, i) => {
            const matchingFlagName = this.findMatchingFlagName(argv);

            if (matchingFlagName) {
                const matchingFlag = this.flags[matchingFlagName];
                if (typeof matchingFlag.value === 'boolean') {
                    matchingFlag.value = true;
                } else {
                    // Value follows flag
                    matchingFlag.value = rawArgv[i + 1];
                }
            }
        });
    }

    /**
     * Override flags and switches with angular playground configuration JSON file
     * @param playgroundConfig
     */
    applyConfigurationFile(playgroundConfig: any) {
        Object.keys(playgroundConfig).forEach(key => {
            if (key !== 'angularCli') {
                if (this.flags.hasOwnProperty(key)) {
                    this.flags[key].value = playgroundConfig[key];
                }
            } else {
                // Nested flag
                Object.keys(playgroundConfig.angularCli).forEach(cliKey => {
                    this.setAngularCliFlag(cliKey, playgroundConfig[key][cliKey]);
                });
            }
        });

        const missingFlag = this.getAnyUnfulfilledFlag();
        if (missingFlag !== undefined) {
            throw new Error(`CLI flag ${missingFlag.aliases[0]} needs a value.`);
        }
    }

    // TODO: Refactor to use "Flag directories" for future directory support and maintenance
    private setAngularCliFlag(key: string, value: any) {
        switch (key) {
            case 'appName':
                this.flags.ngCliApp.value = value;
                break;
            case 'port':
                this.flags.ngCliPort.value = value;
                break;
            case 'environment':
                this.flags.ngCliEnv.value = value;
                break;
            case 'cmdPath':
                this.flags.ngCliCmdPath.value = value;
                break;
        }
    }

    private findMatchingFlagName(alias: string): string {
        const matchingIndex = Object.keys(this.flags)
            .map(key => this.flags[key].aliases)
            .findIndex(aliases => aliases.indexOf(alias) !== -1);
        return matchingIndex > -1 ? Object.keys(this.flags)[matchingIndex] : undefined;
    }

    private getAnyUnfulfilledFlag(): Flag {
        return Object.keys(this.flags)
            .map(key => this.flags[key])
            .find(flag => flag.required && flag.value === null);
    }
}
