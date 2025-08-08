import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementBonusService } from 'app/service/admin/management-bonus.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommissionManagementResolver implements Resolve<BaseResponse> {

    constructor(private _manageBonusReqService: ManagementBonusService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._manageBonusReqService.prepare();
    }
}
