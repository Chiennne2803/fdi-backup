import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertDTO } from 'app/models/base/alert';
import { FuseAlertService } from '@fuse/components/alert';

@Component({
    selector: 'empty-layout',
    templateUrl: './empty.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EmptyLayoutComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public lstNotify: Array<AlertDTO>;

    /**
     * Constructor
     */
    constructor(
        private _fuseAlertService: FuseAlertService,

    ) {
        this._fuseAlertService.lstNotify.subscribe(res => this.lstNotify = res);

    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
