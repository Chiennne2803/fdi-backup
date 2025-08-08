import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {APP_TEXT} from 'app/shared/constants';


export interface DialogData {
    redirectUrl: string;
    redirectType: number;
    message: string;
    complete: () => void;
}

@Component({
    selector     : 'modal-notify',
    templateUrl  : './modal-notify.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ModalNotifyComponent implements OnInit {
    public appText = APP_TEXT;

    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _router: Router
        ) {
    }

    ngOnInit(): void {
    }

    redirectLogin(): any {
        this.data.complete();
        return this._router.navigate([this.data.redirectUrl]);
    }
}
