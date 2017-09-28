import { Component, Input } from '@angular/core';
@Component({
  selector: 'ex-star-rating',
  template: `<span *ngFor="let index of starNumbers">*</span>`
})
export class StarRatingComponent {
  starNumbers;

  @Input() set stars(value: number) {
    this.starNumbers = Array.from(Array(value),(x,i)=>i);
  };
}
