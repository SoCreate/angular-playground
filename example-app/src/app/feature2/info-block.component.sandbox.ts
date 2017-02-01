import { sandboxOf } from 'angular-playground';
import { InfoBlockComponent } from './info-block.component';

export default sandboxOf(InfoBlockComponent)
  .add('A general example', {
    template: `
      <ex-info-block state="info">
        This is a general info block example component
        in Playground
      </ex-info-block>`
    })
  .add('A warning example', {
    template: `
      <ex-info-block state="warning">
        This is a "warning" info block example 
        component in Playground
      </ex-info-block>`
    })
  .add('An error example', {
    template: `
      <ex-info-block state="error">
        This is an "error" info block example 
        component in Playground
      </ex-info-block>`
    });
