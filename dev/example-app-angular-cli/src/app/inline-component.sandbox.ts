import { Component } from '@angular/core';
import { sandboxOf } from 'angular-playground';

@Component({
  selector: 'ex-inline',
  template: `I was created in a .sandbox.ts file...super easy!`
})
class InlineComponent {}

export default sandboxOf(InlineComponent)
  .add('default', {
    template: `<ex-inline></ex-inline>`
  });
