import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'ap-drawer',
    templateUrl: './drawer/drawer.component.html',
    styleUrls: ['./drawer/drawer.component.css']
})
export class DrawerComponent {
    @Output() openCommandBarClick = new EventEmitter();
    expanded = false;

    openCommandBar() {
        this.openCommandBarClick.emit();
    }
}
