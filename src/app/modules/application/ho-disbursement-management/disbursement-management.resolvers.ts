import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { DisbursementTransactionService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DraftTransaction implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _disbursementTransactionService: DisbursementTransactionService) {
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
        return this._disbursementTransactionService.draftTransaction();
    }
}

@Injectable({
    providedIn: 'root'
})
export class WaitProcessTransaction implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _disbursementTransactionService: DisbursementTransactionService) {
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
        return this._disbursementTransactionService.waitProcessTransaction();
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
    constructor(private _disbursementTransactionService: DisbursementTransactionService) {
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
        return this._disbursementTransactionService.successTransaction();
    }
}
