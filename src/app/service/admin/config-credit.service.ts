import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsConfCreditDTO} from '../../models/service/FsConfCreditDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsConfRateDTO} from "../../models/service/FsConfRateDTO.model";

/**
 * tuy chinh san pham tin dung/ quan ly phan hang tin dung
 */
@Injectable({
    providedIn: 'root'
})
export class ConfCreditService extends BaseService {
    // public _configCredits: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    public _configCreditDetail: BehaviorSubject<FsConfCreditDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'configService/configCredit');
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                // this._prepareListRank.next(res.payload.lstRanks);
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
    getDetail(payload: FsConfCreditDTO = new FsConfCreditDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._configCreditDetail.next(res.payload);
            })
        );
    }


    /**
     * doCreate
     *
     * @param payload
     */
    create(payload: FsConfCreditDTO = new FsConfCreditDTO()): Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: FsConfCreditDTO = new FsConfCreditDTO()): Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    setDefaultFsConfCredit(payload: FsConfCreditDTO) : Observable<BaseResponse>{
        return this.doPost('setDefaultFsConfCredit',payload)
    }
}
