import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { WithdrawCashManagerService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WithdrawManagementWaitingResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _withdrawCashManagerService: WithdrawCashManagerService) {
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
        return this._withdrawCashManagerService.doSearchWaitProcessTransaction();
    }
}

@Injectable({
    providedIn: 'root'
})
export class WithdrawManagementProcessedResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _withdrawCashManagerService: WithdrawCashManagerService) {
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
        return this._withdrawCashManagerService.doSearchProcessedTransaction();
    }
}
