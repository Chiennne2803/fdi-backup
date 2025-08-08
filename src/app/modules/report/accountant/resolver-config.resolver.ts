import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import {Observable} from 'rxjs';
import {
    ReportBusinessLoanService,
    ReportContractTrackingService,
    ReportInvestorService,
    ReportServiceFeeService,
    ReportTopupRequestService,
    ReportTranspayRequestService,
    ReportWithdrawCashService
} from "../../../service";
import {ReportTransferTransactionService} from "../../../service/report/accountant/report-transfer-transaction.service";

@Injectable({
    providedIn: 'root'
})
export class InvestorWithdrawalReportResolver implements Resolve<BaseResponse> {
    constructor(private _reportWithdrawCashService: ReportWithdrawCashService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._reportWithdrawCashService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class InvestorChargeReportResolver implements Resolve<BaseResponse> {
    constructor(private _reportTopupRequestService: ReportTopupRequestService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._reportTopupRequestService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportTranspayReqResolver implements Resolve<BaseResponse> {
    constructor(private _reportTranspayRequestService: ReportTranspayRequestService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._reportTranspayRequestService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportBusinessLoanResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportBusinessLoanService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportContractTrackingResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportContractTrackingService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportInvestorResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportInvestorService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportServiceFeeResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportServiceFeeService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportTransferTransactionResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportTransferTransactionService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}
