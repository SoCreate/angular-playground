class Flag {
    constructor(
        public aliases: string[],
        public value: any,
        public required = false
    ) {}
}

/**
 * Configuration object used to parse and assign command line arguments
 */
export class Configuration {
    flags: any = {
        noWatch: new Flag(['--no-watch'], false),
        noServe: new Flag(['--no-serve'], false),
        checkErrors: new Flag(['--check-errors'], false),
        randomScenario: new Flag(['--random-scenario'], false),
        sourceRoot: new Flag(['--src', '-S'], './src', true),
        config: new Flag(['--config', '-C'], 'angular-playground.json'),
        timeout: new Flag(['--timeout'], 90),
        angularCli: {
            appName: new Flag(['--ng-cli-app'], 'playground'),
            environment: new Flag(['--ng-cli-env'], null),
            port: new Flag(['--ng-cli-port'], 4201),
            cmdPath: new Flag(['--ng-cli-cmd'], 'node_modules/@angular/cli/bin/ng')
        }
    };

    // Used to tailor the version of headless chromium ran by puppeteer
    chromeArguments = [ '--disable-gpu', '--no-sandbox' ];

    constructor(rawArgv: string[]) {
        // Apply command line arguments
        rawArgv.forEach((argv, i) => {
            const matchingFlag = this.findFlag(argv, this.flags);
            if (!matchingFlag) return;

            if (typeof matchingFlag.value === 'boolean') {
                matchingFlag.value = true;
            } else {
                matchingFlag.value = rawArgv[i + 1];
            }
        });
    }

    /**
     * Override flags and switches with angular playground configuration JSON file
     * @param playgroundConfig
     */
    applyConfigurationFile(playgroundConfig: any) {
        Object.keys(playgroundConfig).forEach(key => {
            if (this.instanceOfFlagGroup(this.flags[key])) {
                Object.keys(playgroundConfig[key]).forEach(nestedKey => {
                    if (this.flags[key].hasOwnProperty(nestedKey)) {
                        this.flags[key][nestedKey].value = playgroundConfig[key][nestedKey];
                    }
                });
            } else {
                if (this.flags.hasOwnProperty(key)) {
                    this.flags[key].value = playgroundConfig[key];
                }
            }
        });
    }

    /**
     * Return a flag that contains the provided alias or undefined if none found
     * @param alias - Alias provided by argv. e.g. --config
     * @param flagGroup - Grouping of flags to check
     */
    private findFlag(alias: string, flagGroup: any): Flag {
        return this.getValues(flagGroup).find(flag => {
            if (this.instanceOfFlagGroup(flag)) {
                return this.findFlag(alias, flag);
            }

            return flag.aliases.includes(alias);
        });
    }

    // Shim for Object.values()
    private getValues(obj: any): any[] {
        const vals = [];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                vals.push(obj[key]);
            }
        }

        return vals;
    }

    /**
     * Determines if provided item is a Flag or Flag-group
     * @param item - Flag or Flag-group
     */
    private instanceOfFlagGroup(item: any) {
        return !item.hasOwnProperty('value');
    }
}
