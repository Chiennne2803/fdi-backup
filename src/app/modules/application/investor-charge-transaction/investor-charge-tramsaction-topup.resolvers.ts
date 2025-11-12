import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';

import { TopUpTransactionService } from 'app/service/admin/topup-transaction.service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorTransaction implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _topUpTransactionService: TopUpTransactionService) {
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
        return this._topUpTransactionService.doSearchWaitTransaction();
    }
}

@Injectable({
    providedIn: 'root'
})
export class WaitTransaction implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _topUpTransactionService: TopUpTransactionService) {
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
        return this._topUpTransactionService.doSearchWaitTransaction();
    }
}


