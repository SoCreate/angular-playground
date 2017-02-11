import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeComponent } from './notice.component';
import { CounterService } from './counter.service';
@NgModule({
  imports: [CommonModule],
  declarations: [NoticeComponent],
  exports: [NoticeComponent],
  providers: [CounterService]
})
export class SharedModule {}
