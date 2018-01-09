import { StringBuilder } from '../src/string-builder';

it('should append newlines to each added line', () => {
    const builder = new StringBuilder();
    builder.addLine('test');
    builder.addLine('test2');
    expect(builder.dump()).toBe('test\ntest2\n');
});

it('should clear out internal data structure after dumping', () => {
    const builder = new StringBuilder();
    builder.addLine('test');
    builder.dump();
    expect(builder.dump()).toBe('\n');
});
