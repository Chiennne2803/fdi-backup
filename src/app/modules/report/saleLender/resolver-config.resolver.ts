import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {ReportDebtService, ReportLenderLoanService, ReportLenderService} from "../../../service";

@Injectable({
    providedIn: 'root'
})
export class ReportDebtResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportDebtService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        const request: BaseRequest = new BaseRequest();
        request.page = 1000;
        request.limit = 1000;
        return this._service.doSearch(request);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportLenderResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportLenderService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReportLenderLoanResolver implements Resolve<BaseResponse> {
    constructor(private _service: ReportLenderLoanService) {    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.doSearch();
    }
}
