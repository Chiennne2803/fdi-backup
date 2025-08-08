import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { TranspayInvestorTransactionService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvestorRefundResolver implements Resolve<BaseResponse> {
    constructor(
        private _transpayReqTransactionService: TranspayInvestorTransactionService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._transpayReqTransactionService.prepare();
    }
}
