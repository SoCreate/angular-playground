import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'ex-person-bio',
  template: `A big person bio`,
  styles: [`:host { display: block; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonBioComponent {}
