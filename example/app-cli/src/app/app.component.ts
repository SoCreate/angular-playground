import { Component } from '@angular/core';

@Component({
  selector: 'ng-app',
  template: `
    <h1>The host app</h1>
    <button [routerLink]="['/', {outlets: {display: 'viewperson'}}]">See Person</button>
    <div>
      <router-outlet name="display"></router-outlet>
    </div>
    <ex-info-block>Note that this is a sample app</ex-info-block>
    <ex-notice>Host app loaded</ex-notice>
    <ex-notice>Ready for showtime!</ex-notice>
  `
})
export class AppComponent {}
