import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { TranspayReqTransactionService } from 'app/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WaitPayTransResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _transService: TranspayReqTransactionService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._transService.doSearchWaitPayTransaction();
    }
}
