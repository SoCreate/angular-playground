import { sandboxOf } from 'angular-playground';
import { AnimatedComponent } from './animated.component';
export default sandboxOf(AnimatedComponent)
  .add('default', {
    template: `<ex-animated></ex-animated>`
  });
