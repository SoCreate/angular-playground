import {} from 'jest';
import { buildSandboxFileContents, findSandboxes, SandboxFileInformation, slash } from '../src/build-sandboxes';

describe('findSandboxes', () => {
    let sandboxes;

    beforeEach(() => {
        sandboxes = findSandboxes('./cli/test/files/sandboxes/');
    });

    it('should find sandbox files and assemble multiple sandboxes', () => {
        expect(sandboxes.length).toBe(2);
    });

    it('should create a key that contains the path to the sandbox', () => {
        expect(sandboxes[0].key).toBe('cli/test/files/sandboxes/example1.sandbox');
        expect(sandboxes[1].key).toBe('cli/test/files/sandboxes/example2.sandbox');
    });

    it('should find the sandbox label among the configuration options', () => {
        expect(sandboxes[0].label).toBe('');
        expect(sandboxes[1].label).toBe('test');
    });

    it('should put together correct metadata from a sandbox', () => {
        expect(sandboxes[0].key).toBe('cli/test/files/sandboxes/example1.sandbox');
        expect(sandboxes[0].searchKey).toBe('ExampleComponent');
        expect(sandboxes[0].name).toBe('ExampleComponent');
        expect(sandboxes[0].label).toBe('');
    });

    it('should find all scenarios associated with a sandbox', () => {
        expect(sandboxes[0].scenarioMenuItems.length).toBe(2);
        expect(sandboxes[0].scenarioMenuItems[0].description).toBe('Default');
        expect(sandboxes[0].scenarioMenuItems[1].description).toBe('With Wrapper');
    });

    it('should ignore commented-out scenarios', () => {
        // Example 2 component contains commented-out scenario
        expect(sandboxes[1].scenarioMenuItems.length).toBe(2);
    });

    it('should find all scenarios associated with a sandbox, excluding commented-out scenarios', () => {
        expect(sandboxes[1].scenarioMenuItems[0].description).toBe('Other');
        expect(sandboxes[1].scenarioMenuItems[1].description).toBe('An other!');
        expect(sandboxes[1].scenarioMenuItems.map(sc => sc.description).indexOf('Commented out')).toBe(-1);
    });

    it('should find scenarios that are listed after commented-out scenarios', () => {
        expect(sandboxes[1].scenarioMenuItems[1].description).toBe('An other!');
    });
});

describe('buildSandboxFileContents', () => {
    let sandboxes: SandboxFileInformation[] = [];

    beforeEach(() => {
        sandboxes = [
            {
                key: 'cli/test/files/sandboxes/example1.sandbox',
                searchKey: 'ExampleComponent',
                name: 'ExampleComponent',
                label: '',
                scenarioMenuItems: [
                    {
                        key: 1,
                        description: 'Default'
                    },
                    {
                        key: 2,
                        description: 'With Wrapper'
                    }
                ]
            },
            {
                key: 'cli/test/files/sandboxes/other.sandbox',
                searchKey: 'OtherComponent',
                name: 'OtherComponent',
                label: '',
                scenarioMenuItems: [
                    {
                        key: 1,
                        description: 'Default'
                    }
                ]
            }
        ];
    });

    describe('exported functions', () => {
        it('should return a function, getSandboxMenuItems, with the JSON string contents of the sandboxes', () => {
            const fileContents = buildSandboxFileContents(sandboxes, 'home/', 'lazy');
            expect(fileContents).toContain(JSON.stringify(sandboxes));
        });

        it('should return a function, getSandbox, that includes imports to sandbox files', () => {
            const fileContents = buildSandboxFileContents(sandboxes, 'home/', 'lazy');
            expect(fileContents).toContain('import( /* webpackMode: "lazy" */ \'home/cli/test/files/sandboxes/example1.sandbox\')');
            expect(fileContents).toContain('import( /* webpackMode: "lazy" */ \'home/cli/test/files/sandboxes/other.sandbox\')');
        });


        it('should include exports for both sandbox-fetching functions', () => {
            const fileContents = buildSandboxFileContents(sandboxes, 'home/', 'eager');
            expect(fileContents).toContain('exports.getSandboxMenuItems = getSandboxMenuItems;');
            expect(fileContents).toContain('exports.getSandbox = getSandbox;');
        });
    });

    describe('getSandbox', () => {
        it('should return the serialized sandbox', () => {
            const fileContents = buildSandboxFileContents(sandboxes, 'home/', 'lazy');
            expect(fileContents).toContain('return _.default.serialize(\'cli/test/files/sandboxes/example1.sandbox\')');
            expect(fileContents).toContain('return _.default.serialize(\'cli/test/files/sandboxes/other.sandbox\')');
        });
    });

    describe('webpack strategy', () => {
        it('should use lazy webpack resolution strategy if lazy is provided as a parameter', () => {
            const fileContents = buildSandboxFileContents(sandboxes, 'home/', 'lazy');
            expect(fileContents).toContain('import( /* webpackMode: "lazy" */ \'home/cli/test/files/sandboxes/example1.sandbox\')');
            expect(fileContents).not.toContain('eager');
        });

        it('should use eager webpack resolution strategy if lazy is provided as a parameter', () => {
            const fileContents = buildSandboxFileContents(sandboxes, 'home/', 'eager');
            expect(fileContents).toContain('import( /* webpackMode: "eager" */ \'home/cli/test/files/sandboxes/example1.sandbox\')');
            expect(fileContents).not.toContain('lazy');
        });
    });
});

describe('slash', () => {
    it('should convert Windows-style path to unix-style', () => {
        const windowsPath = 'c:\\etc\\';
        expect(slash(windowsPath)).toBe('c:/etc/')
    });
});
