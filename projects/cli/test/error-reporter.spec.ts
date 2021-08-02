import { ErrorReporter, REPORT_TYPE } from '../src/error-reporter';
const chalk = require('chalk');
const fs = require('fs');

describe('ErrorReporter', () => {
    const mockScenarios = [{
        name: 'textbox',
        description: 'Default',
        sandboxKey: 'textbox',
        scenarioKey: 1,
    }];
    let reporter;

    beforeEach(() => {
        reporter = new ErrorReporter(mockScenarios, 'output.json', REPORT_TYPE.LOG);
    });

    it('should initialize with no errors', () => {
        expect(reporter.errors.length).toBe(0);
    });

    it('should add descriptions and scenarios separately to errors array', () => {
        reporter.addError('LOG Error', 'http://localhost:4201/textbox');
        expect(reporter.errors.length).toBe(1);
        expect(reporter.errors).toEqual([{
            descriptions: 'LOG Error',
            scenario: 'http://localhost:4201/textbox',
        }]);
    });

    it('should console.log on compileReport if report type is log', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() =>{});
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() =>{});
        reporter.addError('LOG Error', 'http://localhost:4201/textbox');
        reporter.addError('Read Error', 'http://localhost:4201/textbox');
        reporter.compileReport();
        expect(errorSpy).toHaveBeenCalledWith(chalk.red('Error in the following scenarios'));
        expect(consoleSpy).toHaveBeenCalledTimes(4);
    });

    it('should write to file if report type is json', () => {
        const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() =>{});
        reporter.type = REPORT_TYPE.JSON;
        reporter.addError('LOG Error', 'http://localhost:4201/textbox');
        reporter.addError('Read Error', 'http://localhost:4201/textbox');
        reporter.compileReport();
        expect(writeFileSpy).toHaveBeenCalled();
    });

    it('should write to file if report type is xml', () => {
        const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() =>{});
        reporter.type = REPORT_TYPE.XML;
        reporter.addError('LOG Error', 'http://localhost:4201/textbox');
        reporter.addError('Read Error', 'http://localhost:4201/textbox');
        reporter.compileReport();
        expect(writeFileSpy).toHaveBeenCalled();
    });
});
