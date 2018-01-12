import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { Feature1Module } from './feature1/feature1.module';
import { Feature2Module } from './feature2/feature2.module';
import { RouterModule } from '@angular/router';
import { Feature3Module } from './feature3/feature3.module';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    environment.production
      ? ServiceWorkerModule.register('/ngsw-worker.js')
      : [],
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
