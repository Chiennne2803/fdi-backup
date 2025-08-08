import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {MatDrawer} from "@angular/material/sidenav";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'main-screen',
    templateUrl: './main-screen.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class MainScreenComponent {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public screenMode: string;

    constructor(
        private _route: Router,
        private route: ActivatedRoute,
    ) {
        this.route.params.subscribe(params => {
            this.screenMode = params['key'];
        });
    }
}
