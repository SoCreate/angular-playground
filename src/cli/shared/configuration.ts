interface Flags {
    [key: string]: {
        aliases: string[];
        active: boolean;
    };
}

interface Switches {
    [key: string]: {
        aliases: string[];
        value: any;
    };
}

/**
 * Configuration object used to parse and assign command line arguments
 */
export class Configuration {
    flags: Flags = {
        noWatch: {
            aliases: ['--no-watch', '-W'],
            active: false
        },
        noServe: {
            aliases: ['--no-serve', '-S'],
            active: false
        },
        runCheckErrors: {
            aliases: ['--check-errors', '-E'],
            active: false
        },
        randomScenario: {
            aliases: ['--random-scenario', '-R'],
            active: false
        }
    };

    switches: Switches = {
        config: {
            aliases: ['--config', '-C'],
            value: 'angular-playground.json'
        },
        port: {
            aliases: ['--port', '-P'],
            value: 4201
        },
        timeoutAttempts: {
            aliases: ['--timeout-attempts', '-TA'],
            value: 90
        }
    };

    chromeArguments = [ '--disable-gpu', '--no-sandbox' ];

    constructor(rawArgv: string[]) {
        const { argvFlags, argvSwitches } = this.separateRawArguments(rawArgv);
        this.configureFlags(argvFlags);
        this.configureArguments(argvSwitches);
    }

    get baseUrl(): string {
        return `http://localhost:${this.switches.port.value}`;
    }

    // Boolean flags
    private configureFlags(argvFlags: string[]) {
        Object.keys(this.flags).forEach(flag => {
            const currentFlag = this.flags[flag];
            currentFlag.active = this.argInList(currentFlag.aliases, argvFlags);
        });
    }

    // Arguments that may have values attached
    private configureArguments(argvSwitches: string[]) {
        Object.keys(this.switches).forEach(switchName => {
            const currentSwitch = this.switches[switchName];
            const switchIndex = this.argInListWithIndex(currentSwitch.aliases, argvSwitches);

            if (switchIndex !== -1) {
                currentSwitch.value = this.getArgValue(switchIndex, argvSwitches);
            } else if (switchName === 'config' && argvSwitches.length > 0) {
                // Support default argument for config path
                currentSwitch.value = argvSwitches[0];
            }
        });
    }

    /**
     * Separates flags and switches
     * @param argv - Process arguments
     */
    private separateRawArguments(argv: string[]): { argvFlags: string[], argvSwitches: string[] } {
        const argvFlags: string[] = [];

        const argvSwitches = argv.reduce((accr, value) => {
            Object.keys(this.flags)
                .map(key => this.flags[key].aliases)
                .forEach(aliases => {
                    this.argInList([value], aliases)
                        ? argvFlags.push(value)
                        : accr.push(value);
                });
            return accr;
        }, []);

        return { argvFlags, argvSwitches };
    }

    /**
     * Gets the value of an argument from list of args (next consecutive argument)
     * e.g. --config ./src/
     * @param startingIndex - Index of argument
     * @param args - list of args
     */
    private getArgValue(startingIndex: number, args: string[]): string {
        return args[startingIndex + 1];
    }

    /**
     * Returns whether or not the argument or its alias is present in the list of all arguments
     * @param argumentWithAlias - List of arguments and aliases
     * @param allArguments - Process argv
     */
    private argInList(argumentWithAlias: string[], allArguments: string[]): boolean {
        return this.argInListWithIndex(argumentWithAlias, allArguments) !== -1;
    }

    /**
     * Returns index of the argument or its alias in the list of all arguments. -1 if not found.
     * @param argumentWithAlias - List of arguments and aliases
     * @param allArguments - Process argv
     */
    private argInListWithIndex(argumentWithAlias: string[], allArguments: string[]): number {
        const argumentOrAliasIndex = allArguments.findIndex(argv => {
            return argumentWithAlias.indexOf(argv) !== -1;
        });
        return argumentOrAliasIndex;
    }
}
