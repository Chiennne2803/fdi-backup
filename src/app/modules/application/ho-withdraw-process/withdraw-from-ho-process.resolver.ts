import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import { ManagementWithdrawHOReqService } from '../../../service/admin/management-withdraw-ho-req.service';

@Injectable({
    providedIn: 'root'
})
export class WithdrawFromHoProcessResolver implements Resolve<BaseResponse> {
    constructor(
        private _service: ManagementWithdrawHOReqService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.prepare();
    }
}
