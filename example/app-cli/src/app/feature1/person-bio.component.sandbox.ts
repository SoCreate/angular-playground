import {sandboxOf} from 'angular-playground';
import {PersonBioComponent} from './person-bio.component';
export default sandboxOf(PersonBioComponent, {prependText:'feature1.'})
  .add('default', {template:`<ex-person-bio></ex-person-bio>`});
