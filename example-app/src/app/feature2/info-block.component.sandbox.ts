import { sandboxOf } from 'angular-playground';
import { InfoBlockComponent } from './info-block.component';
export default sandboxOf(InfoBlockComponent)
  .add('with text', {template: '<ex-info-block>Here is some information</ex-info-block>'});
