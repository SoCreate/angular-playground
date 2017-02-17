import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeComponent } from './notice.component';
import { CounterService } from './counter.service';
import { PersonBioComponent } from './person-bio.component';
@NgModule({
  imports: [CommonModule],
  declarations: [
    NoticeComponent,
    PersonBioComponent
  ],
  exports: [NoticeComponent],
  providers: [CounterService]
})
export class SharedModule {}
