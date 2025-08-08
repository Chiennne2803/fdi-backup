import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTopupDTO} from 'app/models/service';
import {Observable} from 'rxjs';
import {BaseService} from '../base-service';
import {FsReqTransP2PDTO} from "../../models/service/FsReqTransP2PDTO.model";
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class InvestmentTransferService extends BaseService {
    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'investorReqTransP2P');
    }

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
    }

    /**
     * get list sell
     *
     * @param payload
     */
    getListSell(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListSell', payload);
    }

    /**
     * get list buy
     *
     * @param payload
     */
    getListBuy(payload: FsReqTransP2PDTO = new FsReqTransP2PDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListBuy', payload);
    }

    /**
     * get list buy complete
     *
     * @param payload
     */
    getListBuyComplete(payload: FsReqTransP2PDTO = new FsReqTransP2PDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListBuyComplete', payload);
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: FsTopupDTO = new FsTopupDTO()):
        Observable<any> {
        return this.doCreate(payload);
    }

    /**
     * prepare loading page
     *
     */
    prepareLoading():
        Observable<any> {
        return this.prepareLoadingPage();
    }
}
