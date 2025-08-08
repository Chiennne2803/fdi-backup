import {Injectable} from '@angular/core';
import {BaseService} from '../base-service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseRequest, BaseResponse} from '../../models/base';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class StatisticalReportService extends BaseService {
    private _prepareInvestorTrans: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _investorWithdrawalReport: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _investorChargeReport: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _businessReturnReport: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'transpayReqTransaction');
    }

    get investorWithdrawalReport$(): Observable<BaseResponse> {
        return this._investorWithdrawalReport.asObservable();
    }

    get investorChargeReport$(): Observable<BaseResponse> {
        return this._investorChargeReport.asObservable();
    }

    get businessReturnReport$(): Observable<BaseResponse> {
        return this._businessReturnReport.asObservable();
    }

    /**
     * doSearchWithdrawalReport
     *
     * @param payload
     */
    doSearchWithdrawalReport(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('errorTransaction', payload).pipe(
            tap(res => this._investorWithdrawalReport.next(res))
        );
    }

    /**
     * doSearchChargeReport
     *
     * @param payload
     */
    doSearchChargeReport(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('errorTransaction', payload).pipe(
            tap(res => this._investorChargeReport.next(res))
        );
    }

    /**
     * doSearchBusinessReturnReport
     *
     * @param payload
     */
    doSearchBusinessReturnReport(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('errorTransaction', payload).pipe(
            tap(res => this._businessReturnReport.next(res))
        );
    }
}
