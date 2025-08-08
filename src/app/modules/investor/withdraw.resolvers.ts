import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BaseResponse } from 'app/models/base';
import { TransWithdrawCashService } from 'app/service/investor/trans-withdraw-cash.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class WithdrawResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _withdrawService: TransWithdrawCashService) {
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
        return this._withdrawService.doSearch();
    }
}
