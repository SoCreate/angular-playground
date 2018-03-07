import {} from 'jest';
import { findSandboxes } from '../src/build-sandboxes';

describe('findSandboxes', () => {
    let sandboxes;

    beforeEach(() => {
        sandboxes = findSandboxes('./cli/test/files/sandboxes/');
    });

    it('should find sandbox files and assemble multiple sandboxes', () => {
        expect(sandboxes.length).toBe(2);
    });

    it('should find label among configuration options', () => {
        console.log(sandboxes);
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

    // TODO:
    // it('should ignore commented-out scenarios', () => {
    //     // Example 2 component contains commented-out scenario
    //     expect(sandboxes[1].scenarioMenuItems.length).toBe(1);
    // });
});
