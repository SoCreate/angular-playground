import { Component } from '@angular/core';

@Component({
  selector: 'global-person-bio',
  template: `<h4>A global person bio</h4><p><ng-content></ng-content></p>`
})
export class PersonBioComponent {}
