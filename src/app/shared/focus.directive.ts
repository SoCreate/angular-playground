import {Directive, Input, ElementRef} from "@angular/core";

@Directive({
  selector: '[apFocus]'
})
export class FocusDirective {
  @Input() set apFocus(value) {
    if(value) {
      this.elementRef.nativeElement.focus();
    }
  }

  constructor(private elementRef: ElementRef) {}
}
