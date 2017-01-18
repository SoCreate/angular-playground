import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
@Component({
  selector: 'ex-person-details',
  template: `
    {{person.fullName}} <template [ngIf]="person.twitterHandle">(<a href="#">{{person.twitterHandle}}</a>)</template>
    <ex-person-bio></ex-person-bio>
  `,
  styles: [`:host{ font-weight: bold;}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonDetailsComponent {
  @Input() person;
}
