import { sandboxOf } from 'angular-playground';
import { <%= classify(name) %>Component } from '<%= flat ? '.' : '..' %>/<%= name %>.component';

export default sandboxOf(<%= classify(name) %>Component)
  .add('default', {
    template: `<<%= selector %>></<%= selector %>>`
  });
