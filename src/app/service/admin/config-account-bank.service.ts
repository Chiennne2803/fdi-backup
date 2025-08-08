import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsAccountBankDTO} from 'app/models/service/FsAccountBankDTO.model';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * cau hinh tai khoan ngan hang
 */
@Injectable({
    providedIn: 'root'
})
export class AccountBankService extends BaseService {
    public _prepareConfig: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'configAccountBank');
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepareConfig.next(res);
            })
        );
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }


    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsAccountBankDTO = new FsAccountBankDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload);
    }


    /**
     * update
     *
     * @param payload
     */
    update(payload: FsAccountBankDTO = new FsAccountBankDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
