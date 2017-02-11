import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {CounterService} from "./shared/counter.service";
import {NoticeComponent} from "./shared/notice.component";

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    NoticeComponent
  ],
  providers: [
    CounterService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
