import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementBonusReqService } from 'app/service/admin/management-bonus-req.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommissionProcessResolver implements Resolve<BaseResponse> {

    constructor(private _manageBonusReqService: ManagementBonusReqService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._manageBonusReqService.prepare();
    }
}
