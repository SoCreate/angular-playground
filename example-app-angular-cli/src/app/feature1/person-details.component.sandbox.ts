import { sandboxOf } from 'angular-playground';
import { PersonDetailsComponent } from './person-details.component';
import { PersonBioComponent } from './person-bio.component';

export default sandboxOf(PersonDetailsComponent, {
  prependText:'feature1.',
  declarations: [PersonBioComponent]
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
