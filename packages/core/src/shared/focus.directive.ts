import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[apFocus]'
})
export class FocusDirective {
  @Input() set apFocus(value: any) {
    if (value) {
      this.elementRef.nativeElement.focus();
    }
  }

  constructor(private elementRef: ElementRef) {
  }
}
