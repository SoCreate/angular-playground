export class StringBuilder {
    private lines: string[] = [];

    addLine(line: string) {
        this.lines.push(line);
    }

    dump(): string {
        const data = this.lines.join('\n') + '\n';
        this.lines = [];
        return data;
    }
}
