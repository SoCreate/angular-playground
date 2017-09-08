export class CounterService {
  private _count;

  constructor() {
    this._count = 0;
  }

  increment() {
    return ++this._count;
  }
}
