import { applyConfigurationFile } from '../src/apply-configuration-file';

it('should throw error when failing to load a configuration file', () => {
    const programMock = { config: './no-config.json' };

    expect(() => {
      const config = applyConfigurationFile(programMock);
    }).toThrow();
});

it('should return config object from configuration file', () => {
    const programMock = { config: './packages/cli/test/test-config.json' };
    const config = applyConfigurationFile(programMock);
    expect(config).not.toBeUndefined();
});
