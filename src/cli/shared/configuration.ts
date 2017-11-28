/**
 * Configuration object used to parse and assign command line arguments
 */
export class Configuration {
    private supportedFlags = {
        noWatch: '--no-watch',
        noServe: '--no-serve',
        checkErrs: '--check-errors',
        randomScenario: '--random-scenario'
    };

    private supportedArguments = {
        config: '--config'
    };

    runWatch: boolean;
    runAngularCliServe: boolean;
    runCheckErrors: boolean;
    randomScenario: boolean;
    configFilePath: string;
    port: number;
    timeoutAttempts = 20;
    chromeArguments = [ '--disable-gpu', '--no-sandbox' ];

    constructor(rawArgv: string[]) {
        const { flags, args } = this.getParsedArguments(rawArgv);
        this.configureFlags(flags);
        this.configureArguments(args);
    }

    get baseUrl(): string {
        return `http://localhost:${this.port}`;
    }

    // Boolean flags
    private configureFlags(flags: string[]) {
        this.runWatch = flags.indexOf(this.supportedFlags.noWatch) === -1;
        this.runAngularCliServe = flags.indexOf(this.supportedFlags.noServe) === -1;
        this.runCheckErrors = flags.indexOf(this.supportedFlags.checkErrs) !== -1;
        this.randomScenario = flags.indexOf(this.supportedFlags.randomScenario) !== -1;
    }

    // Arguments that may have values attached
    private configureArguments(args: string[]) {
        const configIndex = args.indexOf(this.supportedArguments.config);
        if (configIndex !== -1) {
            this.configFilePath = this.getArgValue(configIndex, args);
        } else if (args.length > 0) {
            this.configFilePath = args[0];
        } else {
            this.configFilePath = 'angular-playground.json';
        }
    }

    /**
     * Separates accepted command line arguments from other ts-node arguments
     * @param supportedFlags - Accepted command line flags
     * @param args - Process arguments
     */
    private getParsedArguments(args: string[]): { flags: string[], args: string[] } {
        const flags: string[] = [];

        args = args.reduce((accr, value) => {
            Object.keys(this.supportedFlags)
                .map(key => this.supportedFlags[key])
                .indexOf(value) > -1 ? flags.push(value) : accr.push(value);
            return accr;
        }, []);

        return { flags, args };
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
}
