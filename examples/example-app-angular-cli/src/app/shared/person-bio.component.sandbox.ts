import { PersonBioComponent } from './person-bio.component';
import { sandboxOf } from 'angular-playground';

export default sandboxOf(PersonBioComponent, {label:'shared.'})
  .add('no message', {
    template:`<global-person-bio></global-person-bio>`
  })
  .add('default', {
    template:`<global-person-bio>Some globally accepted info here!</global-person-bio>`
  });
