import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {BaseResponse} from "../../../models/base";
import {ManagementCashInReqService} from "../../../service/admin/management-cash-in-req.service";

@Injectable({
  providedIn: 'root'
})
export class FundingProcessResolver implements Resolve<BaseResponse> {
    constructor(private _managementCashInReqService: ManagementCashInReqService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._managementCashInReqService.prepare();
    }
}
