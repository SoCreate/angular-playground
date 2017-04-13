import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeComponent } from './notice.component';
import { CounterService } from './counter.service';
import { PersonBioComponent } from './person-bio.component';
import { AnimatedComponent } from "./animated.component";

@NgModule({
  imports: [CommonModule],
  declarations: [
    NoticeComponent,
    PersonBioComponent,
    AnimatedComponent
  ],
  exports: [NoticeComponent],
  providers: [CounterService]
})
export class SharedModule {
}
