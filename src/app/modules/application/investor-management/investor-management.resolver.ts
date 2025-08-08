import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementInvestorService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvestorManagementResolver implements Resolve<BaseResponse> {
    constructor(
        private _service: ManagementInvestorService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.prepare();
    }
}
