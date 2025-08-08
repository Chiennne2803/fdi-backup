import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseResponse} from 'app/models/base';
import {FsTransWithdrawCashDTO} from 'app/models/service';
import {environment} from 'environments/environment';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class TransWithdrawCashService extends BaseService {

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, private _httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'transWithdrawCash');
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * Get products
     */
    getPrepareLoadingPage(): Observable<any> {
        return this.prepareLoadingPage();
    }
    /**
     * initTransWithdrawCash
     */
    initTransWithdrawCash(): Observable<BaseResponse> {
        return this.doGet('initTransWithdrawCash');
    }

    transWithdrawCash(path: string, condition: any): Observable<BaseResponse> {
        return this.doPost(path, condition);
    }

    verifySmsOtp(condition): Observable<any> {
        return this._httpClient.post(environment.forgotPasswordVerifyOtpUrl, condition);
    }

    resendSmsOtp(payload): Observable<any> {
        return this.resendOtp(payload);
    }
}
