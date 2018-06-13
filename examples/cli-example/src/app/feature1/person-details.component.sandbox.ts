import { sandboxOf } from 'angular-playground';
import { PersonDetailsComponent } from './person-details.component';
import { PersonBioComponent } from './person-bio.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export default sandboxOf(PersonDetailsComponent, {
  label:'feature1',
  declarations: [PersonBioComponent],
  entryComponents: [PersonBioComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
  .add('person with name and twitter', {
    template: '<ex-person-details [person]="person"></ex-person-details>',
    context: {
      person: {
        fullName: 'Tom Hardy',
        twitterHandle: 'mjones'
      }
    }
  })
  .add('person with name', {
    template: '<ex-person-details [person]="person"></ex-person-details>',
    context: {person: {fullName: 'Mike Jones'}}
  });
