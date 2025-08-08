import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementCashInService } from 'app/service/admin/management-cash-in.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FundingResolver implements Resolve<BaseResponse> {
    constructor(
        private _manageCashInService: ManagementCashInService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        this._manageCashInService.doSearch().subscribe();
        return this._manageCashInService.prepare();
    }
}
