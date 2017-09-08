export class CounterService {
  private _count: number;

  constructor() {
    this._count = 0;
  }

  increment() {
    return ++this._count;
  }
}
