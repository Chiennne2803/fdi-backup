import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementWithdrawHOService } from 'app/service/admin/management-withdraw-ho.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WithdrawFromHOResolver implements Resolve<BaseResponse> {
    constructor(
        private _managementWithdrawHO: ManagementWithdrawHOService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._managementWithdrawHO.prepare();
    }
}
