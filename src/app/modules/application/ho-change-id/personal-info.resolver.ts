import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import { ManagementAccountInfoReqService } from './../../../service/admin/management-account-info-req.service';

@Injectable({
    providedIn: 'root'
})
export class PersonalInfoResolver implements Resolve<BaseResponse> {
    constructor(
        private _service: ManagementAccountInfoReqService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.search();
    }
}
