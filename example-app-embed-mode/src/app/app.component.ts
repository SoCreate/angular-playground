import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `
    <h1>Example App to Show Embed Mode</h1>
    <a href="http://localhost:4201?select=notice/short text">View in Playground</a>
    <iframe src="http://localhost:4201?embed=notice/short text" frameborder="0" width="100%"></iframe>
    <a href="http://localhost:4201?select=persondetails/person with name and twitter">View in Playground</a>
    <iframe src="http://localhost:4201?embed=persondetails/person with name and twitter" frameborder="0" width="100%"></iframe>
  `
})
export class AppComponent {}
