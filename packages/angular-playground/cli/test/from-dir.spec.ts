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
        const foo = {
            cb: () => {
            }
        };
        const cbSpy = spyOn(foo, 'cb');

        fromDir(dir, regex, foo.cb);
        expect(cbSpy).toHaveBeenCalledTimes(2);
    });

    it('should not apply callback to files that don\' match regex', () => {
        const regex = /\.spec.ts$/;
        const foo = {
            cb: () => {
            }
        };
        const cbSpy = spyOn(foo, 'cb');

        fromDir(dir, regex, foo.cb);
        expect(cbSpy).not.toHaveBeenCalled();
    });

    it('should apply recursively to sub-directories', () => {
        const regex = /\.csv$/;
        const foo = {
            cb: () => {
            }
        };
        const cbSpy = spyOn(foo, 'cb');

        fromDir(dir, regex, foo.cb);
        expect(cbSpy).toHaveBeenCalledTimes(1);
    });
});
