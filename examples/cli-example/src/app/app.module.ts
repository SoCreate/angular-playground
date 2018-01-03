import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { Feature1Module } from './feature1/feature1.module';
import { Feature2Module } from './feature2/feature2.module';
import { RouterModule } from '@angular/router';
import { Feature3Module } from './feature3/feature3.module';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule,
    Feature1Module,
    Feature2Module,
    Feature3Module
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
