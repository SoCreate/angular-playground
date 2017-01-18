import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ex-info-block',
  template: `Some info: <ng-content></ng-content>`,
  styles: [`
    :host {
      border: 2px solid black;,
      border-radius: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoBlockComponent { }
