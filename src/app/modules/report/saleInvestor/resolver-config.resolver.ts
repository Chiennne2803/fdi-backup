import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import {Observable} from 'rxjs';
import { ReportPromotionalStatementService } from 'app/service/report/accountant/report-promotional-statement.service';
import {StatisticalReportService} from '../../../service/admin/statistical-report.service';
import {
    ReportAccountInvestorService, ReportInvestService, ReportNewAccountService,
    ReportTopupRequestService,
    ReportTranspayRequestService,
    ReportWithdrawCashService
} from "../../../service";


@Injectable({
    providedIn: 'root'
})
export class ReportPromotionalStatementResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportPromotionalStatementService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportAccountInvestorResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportAccountInvestorService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportInvestResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportInvestService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportNewAccountResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportNewAccountService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}
