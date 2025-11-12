import {
    Component,
    OnDestroy,
    ViewEncapsulation,
} from '@angular/core';
import { FuseAlertService } from '@fuse/components/alert';
import { AlertDTO } from 'app/models/base/alert';
import { Subject } from 'rxjs';
@Component({
    selector: 'auth-layout',
    templateUrl: './auth.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AuthLayoutComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public lstNotifyAuth: Array<AlertDTO>;
    

    /**
     * Constructor
     */
    constructor(
        private _fuseAlertService: FuseAlertService,
       
    ) {
        this._fuseAlertService.lstNotifyAuth.subscribe(res => this.lstNotifyAuth = res);

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // ------
    // -----------------------------------------------------------------------------------------------

    ngOnInit(): void {
        
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    
}
