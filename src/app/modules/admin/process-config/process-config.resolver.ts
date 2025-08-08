import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import {ConfCreditService, ConfRateService, ConfRefundService} from 'app/service';
import { Observable } from 'rxjs';
import {ConfigBonusService} from '../../../service/admin/config-bonus.service';

@Injectable({
    providedIn: 'root'
})
export class ProcessConfigResolver implements Resolve<BaseResponse> {
    constructor(
        private _confRateService: ConfRateService,
        private _confCreditService: ConfCreditService,
        private _confRefundService: ConfRefundService,
        private _configBonusService: ConfigBonusService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        this._confCreditService.doSearch().subscribe();
        return this._confRateService.getPrepareLoadingPage();
    }
}
