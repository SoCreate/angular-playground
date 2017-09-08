import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CounterService } from './counter.service';
@Component({
  selector: 'ex-notice',
  template: `<ng-content></ng-content> [notice #{{count}}]`,
  styles: [`
    :host { display: block; color: green; font-style: italic; }
    :host-context(.green) { color: gray; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeComponent {
  count;

  constructor(public counterService: CounterService) {
    this.count = counterService.increment();
  }
}
