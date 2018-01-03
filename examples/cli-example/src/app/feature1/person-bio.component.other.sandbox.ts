import {sandboxOf} from 'angular-playground';
import {PersonBioComponent} from './person-bio.component';
export default sandboxOf(PersonBioComponent, {label:'feature1'})
  .add('a special case', {template:`<h1>Special Bio</h1><ex-person-bio></ex-person-bio>`});
