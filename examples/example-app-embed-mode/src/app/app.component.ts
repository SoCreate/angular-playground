import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `
    <h1>Example App to Show Embed Mode</h1>
    <a href="http://localhost:4201/?scenario=.%2Fapp%2Fshared%2Fnotice.component.sandbox/short%20text">View in Playground</a>
    <iframe src="http://localhost:4201/?scenario=.%2Fapp%2Fshared%2Fnotice.component.sandbox/short%20text&embed=1" frameborder="0" width="100%"></iframe>
    <a href="http://localhost:4201/?scenario=.%2Fapp%2Ffeature1%2Fperson-details.component.sandbox/person%20with%20name%20and%20twitter">View in Playground</a>
    <iframe src="http://localhost:4201/?scenario=.%2Fapp%2Ffeature1%2Fperson-details.component.sandbox/person%20with%20name%20and%20twitter&embed=1" frameborder="0" width="100%"></iframe>
  `
})
export class AppComponent {}
