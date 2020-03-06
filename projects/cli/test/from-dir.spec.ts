import { fromDirMultiple } from '../src/from-dir';

describe('fromDir', () => {
    const dir = './projects/cli/test/files/from-dir-test/';
    const dir2 = './projects/cli/test/files/from-dir-test-multiple/';

    it('should throw error when directory does not exist', () => {
        const t = () => {
            fromDirMultiple(['foo'], /test/, () => {});
        };
        expect(t).toThrow();
    });

    it('should apply callback to each file process matching regex', () => {
        const regex = /\.json$/;
        const mockCb = jest.fn();

        fromDirMultiple([dir], regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(2);
    });

    it('should not apply callback to files that don\' match regex', () => {
        const regex = /\.spec.ts$/;
        const mockCb = jest.fn();

        fromDirMultiple([dir], regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(0);
    });

    it('should apply recursively to sub-directories', () => {
        const regex = /\.csv$/;
        const mockCb = jest.fn();

        fromDirMultiple([dir], regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(1);
    });

    it('should work for multiple directories', () => {
        const regex = /\.(json|ts)$/;
        const mockCb = jest.fn();

        fromDirMultiple([dir, dir2], regex, mockCb);
        expect(mockCb.mock.calls.length).toBe(5);
    });
});
