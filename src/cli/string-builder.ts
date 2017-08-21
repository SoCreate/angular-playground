export class StringBuilder {
  private lines = [];

  addLine(line) {
    this.lines.push(line);
  }

  dump() {
    let data = this.lines.join('\n');
    data += '\n';
    this.lines = [];
    return data;
  }
}
