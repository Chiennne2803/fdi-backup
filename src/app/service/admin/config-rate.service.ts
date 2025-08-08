import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsConfCreditDTO} from '../../models/service/FsConfCreditDTO.model';
import {FsConfRateDTO} from '../../models/service/FsConfRateDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * tuy chinh san pham tin dung/ lai suat va ky han
 */
@Injectable({
    providedIn: 'root'
})
export class ConfRateService extends BaseService {
    public _prepareListRank: BehaviorSubject<FsConfCreditDTO[]> = new BehaviorSubject(null);
    // public _configRates: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    // public _creditRate: BehaviorSubject<FsConfRateDTO> = new BehaviorSubject(null);
    public _confCreditDetail: BehaviorSubject<FsConfRateDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'configService/configRate');
    }

    public getPrepareLoadingPage(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepareListRank.next(res.payload.lstRank);
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
    getDetail(payload: FsConfRateDTO = new FsConfRateDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._confCreditDetail.next(res.payload);
            })
        );
    }


    /**
     * doCreate
     *
     * @param payload
     */
    create(payload: FsConfRateDTO = new FsConfRateDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: FsConfRateDTO = new FsConfRateDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    /**
     * getCreditRate
     *
     * @param payload
     */
    getCreditRate(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doGet('getCreditRate').pipe(
            tap((res) => {
                this._confCreditDetail.next(res.payload);
            })
        );
    }

    /**
     * updateCreditRate
     *
     * @param payload
     */
    updateCreditRate(payload: FsConfRateDTO = new FsConfRateDTO()):
        Observable<BaseResponse> {
        return this.doPost('updateCreditRate', payload);
    }
}
