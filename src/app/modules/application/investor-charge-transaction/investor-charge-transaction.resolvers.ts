import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { RechargeTransactionService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorTransaction implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _reChargeTransaction: RechargeTransactionService) {
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
        return this._reChargeTransaction.doSearchErrorTransaction();
    }
}

@Injectable({
    providedIn: 'root'
})
export class SuccessTransaction implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _reChargeTransaction: RechargeTransactionService) {
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
        return this._reChargeTransaction.doSearchSuccessTransaction();
    }
}

