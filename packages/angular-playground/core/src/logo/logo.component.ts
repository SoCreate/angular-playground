import { Component } from '@angular/core';

@Component({
    selector: 'ap-logo',
    templateUrl: './logo/logo.component.html',
    styles: [`
    .command-bar__logo {
        height: 30px;
        width: 140px;
    }

    .command-bar__logo__box {
        fill: rgba(255, 255, 255, .1);
        transition: fill 0.2s ease-out;
    }

    .command-bar__logo__letter {
        fill: rgba(255, 255, 255, .5);
        transition: fill 0.2s ease-out;
    }
    `],
})
export class LogoComponent {}
