import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ex-person-block',
  template: `<ex-person-details [person]="person"></ex-person-details>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonBlockComponent {
  person;

  constructor() {
    this.person = { fullName: 'Justin Schwartzenberger', twitterHandle: 'schwarty'}
  }
}
