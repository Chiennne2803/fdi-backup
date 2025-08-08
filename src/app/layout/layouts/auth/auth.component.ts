import {
    Component,
    OnDestroy,
    ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
@Component({
    selector: 'auth-layout',
    templateUrl: './auth.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AuthLayoutComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
       
    ) {}

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
