import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `
    <h1>Example App to Show Embed Mode</h1>
    <a href="http://localhost:4201?scenario=noticecomponent/short text">View in Playground</a>
    <iframe src="http://localhost:4201?scenario=noticecomponent/short text&embed=1" frameborder="0" width="100%"></iframe>
    <a href="http://localhost:4201?scenario=feature1.persondetailscomponent/person with name and twitter">View in Playground</a>
    <iframe src="http://localhost:4201?scenario=feature1.persondetailscomponent/person with name and twitter&embed=1" frameborder="0" width="100%"></iframe>
  `
})
export class AppComponent {}
