import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import {AdmAccessLogService, TranspayInvestorTransactionService} from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvestorResolver implements Resolve<BaseResponse> {
    constructor(
        private _accessLogService: AdmAccessLogService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._accessLogService.doSearchAccessLogInvestor();
    }
}
