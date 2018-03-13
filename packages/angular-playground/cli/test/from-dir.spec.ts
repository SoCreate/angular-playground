import { fromDir } from '../src/from-dir';
import {} from 'jest';

describe('fromDir', () => {
    const dir = './cli/test/files/from-dir-test/';

    it('should throw error when directory does not exist', () => {
        const t = () => {
            fromDir('foo', /test/, () => {
            });
        };
        expect(t).toThrow();
    });

    it('should apply callback to each file process matching regex', () => {
        const regex = /\.json$/;
        const mockCb = jest.fn();
        fromDir(dir, regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(2);
    });

    it('should not apply callback to files that don\' match regex', () => {
        const regex = /\.spec.ts$/;
        const mockCb = jest.fn();

        fromDir(dir, regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(0);
    });

    it('should apply recursively to sub-directories', () => {
        const regex = /\.csv$/;
        const mockCb = jest.fn();

        fromDir(dir, regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(1);
    });
});
