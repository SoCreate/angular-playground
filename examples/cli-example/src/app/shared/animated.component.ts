import { Component } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'ex-animated',
  template: `<div [@itemState]="state" (click)="toggle()">CLICK ME</div>`,
  styles: [`
    :host {padding: 1em; display:block;}
    div { width:100px; height: 20px; padding:4px; text-align: center; cursor:pointer;}
  `],
  animations: [
    trigger('itemState', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class AnimatedComponent {
  state = 'inactive';
  toggle() {
    this.state = this.state === 'inactive' ? 'active' : 'inactive';
  }
}
