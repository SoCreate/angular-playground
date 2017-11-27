/**
 * Separates accepted command line arguments from other ts-node arguments
 * @param supportedFlags - Accepted command line flags
 * @param args - Process arguments
 */
export function getParsedArguments(supportedFlags: string[], args: string[])
        : { flags: string[], args: string[] } {
    const flags: string[] = [];

    args = args.reduce((accr, value) => {
        const flag = getFlag(value);
        supportedFlags.indexOf(flag) > -1 ? flags.push(value) : accr.push(value);
        return accr;
    }, []);

    return { flags, args };
}

/**
 * Only grab flag from arguments with values
 * e.g. --path=./src/
 * @param argument - Flag argument
 */
function getFlag(argument: string): string {
    return argument.split('=')[0];
}
