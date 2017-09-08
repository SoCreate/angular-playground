import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'ex-info-block',
  template: `
    <div [class]="'message message--' + state">
      <svg viewBox="0 0 24 24" *ngIf="state === 'info'" class="message__icon">
        <path d="M24,12c0,6.6-5.4,12-12,12S0,18.6,0,12S5.4,0,12,0S24,5.4,24,12z M10.6,10.7c0.2-0.1,0.4-0.2,0.6-0.2c0.2,0,0.2,0.1,0.2,0.3
        c0,0.2,0,0.4-0.1,0.6c-1.4,4.4-2.1,7.2-2.1,8.4c0,0.4,0.1,0.6,0.3,0.8c0.2,0.2,0.4,0.3,0.8,0.3c0.4,0,0.8-0.2,1.4-0.5
        s1.5-1.1,2.7-2.3l-0.5-0.5c-1.2,1.1-2,1.7-2.2,1.7c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.7,0.5-2.6,1.4-5.9
        c0.6-2,0.9-3.1,0.9-3.4c0-0.2-0.1-0.4-0.2-0.5c-0.2-0.1-0.4-0.2-0.7-0.2c-0.5,0-1.2,0.2-1.9,0.6s-1.6,1.1-2.5,2.1L9,12.1
        C9.8,11.3,10.3,10.9,10.6,10.7z M13.4,3.5c-0.3,0.3-0.4,0.6-0.4,1c0,0.3,0.1,0.6,0.3,0.8c0.2,0.2,0.4,0.3,0.7,0.3
        c0.3,0,0.7-0.2,0.9-0.5c0.3-0.3,0.4-0.7,0.4-1.1c0-0.3-0.1-0.5-0.3-0.7c-0.2-0.2-0.4-0.3-0.7-0.3C14,3.1,13.7,3.2,13.4,3.5z"/>
      </svg>
      <svg viewBox="0 0 17 15.3" *ngIf="state !== 'info'" class="message__icon test">
        <path d="M0.2,13.8c-0.2,0.3-0.3,0.7-0.2,1.1c0.3,0.3,0.7,0.5,1.1,0.4h14.8c0.4,0.1,0.8-0.1,1.1-0.4
        c0.1-0.4,0.1-0.8-0.2-1.1L9.4,0.7C9.2,0.3,8.9,0.1,8.5,0C8.1,0.1,7.8,0.3,7.7,0.7L0.2,13.8z M9.3,13.1c-0.2,0.2-0.5,0.3-0.7,0.3
        c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.2-0.2,0.5-0.3,0.7-0.3c0.3,0,0.5,0.1,0.7,0.3
        c0.2,0.2,0.3,0.4,0.3,0.7C9.6,12.7,9.5,12.9,9.3,13.1L9.3,13.1z M8.6,4.1c0.3,0,0.6,0.1,0.8,0.4c0.2,0.4,0.2,0.8,0.2,1.2
        c0,0.3,0,0.6,0,0.9L9.3,8C9.2,8.3,9.1,8.6,9,8.9C8.9,9.1,8.7,9.2,8.5,9.2C8.3,9.3,8.1,9.1,8,8.9C7.9,8.6,7.8,8.3,7.8,8L7.6,6.7
        c0-0.6-0.1-1.1-0.1-1.4c0-0.3,0.1-0.6,0.3-0.9C8,4.2,8.3,4.1,8.6,4.1z"/>
      </svg>
      <div class="message__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`

    :host {
      display: block;
      font-size: 1rem;
      margin: 1em;
    }

    .message {
      align-items: center;
      display: flex;
      padding: 1em;
    }

    .message__icon {
      height: 2em;
      width: 2em;
    }

    .message__content {
      padding-left: 0.75em;
    }

    /* Info State */
    .message--info {
      background: #e7e7e7;
      color: #555;
    }

    .message--info svg {
      fill: #999;
    }

    /* Warning State */
    .message--warning {
      background: #ff9600;
      color: #fff;
    }

    .message--warning svg {
      fill: #ffcc00;
    }

    /* Error State */
    .message--error {
      background: #ff0000;
      color: #fff;
    }

    .message--error svg {
      fill: #ffb800;
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoBlockComponent {
  @Input('state') state;
}
