import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementTranferWalletReqService } from 'app/service/admin/management-tranfer-wallet-req.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TransferMoneyProcessResolver implements Resolve<BaseResponse> {
    constructor(
        private _service: ManagementTranferWalletReqService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.prepare();
    }
}
