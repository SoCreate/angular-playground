import { Component, Input } from '@angular/core';

@Component({
    selector: 'ap-pin',
    templateUrl: './pin.component.html',
    styles: [`
   .command-bar__scenario-icon {
        display: inline-block;
        fill: white;
        height: 20px;
        margin: 2px 6px 0 0;
        opacity: .2;
        width: 20px;
    }

    .command-bar__scenario-icon--selected {
        fill: #0097fb;
        opacity: 1;
    }
    `],
})
export class PinComponent {
    @Input() selected: boolean;
}
