import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FsDocuments} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FsReqTransP2PDTO} from '../../models/service/FsReqTransP2PDTO.model';
import {FsLoanProfilesDTO, SpEmailConfigDTO} from '../../models/service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {AdmAccessLogDTO} from "../../models/admin/AdmAccessLogDTO.model";


/**
 * chuyen nhuong khoan dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class FsReqTransP2PService extends BaseService {
    public _lenders: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    private _detail: BehaviorSubject<FsReqTransP2PDTO> = new BehaviorSubject(null);
    private _prepareP2P: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'investorReqTransP2P');
    }

    get prepareP2P$(): Observable<BaseResponse> {
        return this._prepareP2P.asObservable();
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepareP2P.next(res);
            })
        );
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    openDetailDrawer(): void {
        this.drawer.open();
    }

    closeDetailDrawer(): void {
        this.drawer.close();
    }

    get detail$(): Observable<FsReqTransP2PDTO> {
        return this._detail.asObservable();
    }

    /**
     * getListSell
     *
     * @param payload
     */
    getListSell(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListSell', payload).pipe(
            tap((res) => {
                this._lenders.next(res);
            })
        );
    }

    /**
     * getListBuy
     *
     * @param payload
     */
    getListBuy(payload: FsReqTransP2PDTO = new FsReqTransP2PDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListBuy', payload).pipe(
            tap((res) => {
                this._lenders.next(res);
            })
        );
    }

    /**
     * getListBuyComplete
     *
     * @param payload
     */
    getListBuyComplete(payload: FsReqTransP2PDTO = new FsReqTransP2PDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListBuyComplete', payload).pipe(
            tap((res) => {
                this._lenders.next(res);
            })
        );
    }

    /**
     * lay danh sach khoan dau tu
     *
     * @param payload
     */
    getListInvestByLoanId(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return this.doPost('getListInvestByLoanId', payload);
    }

    /**
     * huy cau hinh dau tu
     *
     * @param payload
     */
    cancelInvest(payload: FsReqTransP2PDTO = new FsReqTransP2PDTO()):
        Observable<BaseResponse> {
        return this.doPost('cancelInvest', payload);
    }

    /**
     * huy nhieu cau hinh dau tu
     *
     * @param payload
     */
    cancelInvestmulti(payload: any):
        Observable<BaseResponse> {
        return this.doPost('cancelInvestmulti', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: any):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._detail.next(res.payload as FsReqTransP2PDTO);
            })
        );
    }


    /**
     * create
     *
     * @param payload
     */
    create(payload: any):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * buyInvestment
     *
     * @param payload
     */
    buyInvestment(payload: any):
        Observable<BaseResponse> {
        return this.doPost('buyInvestment', payload);
    }

    /**
     * initInvestorTransP2P
     *
     * @param payload
     */
    initInvestorTransP2P(payload: any):
        Observable<BaseResponse> {
        return this.doPost('initInvestorTransP2P', payload);
    }

    downloadContract(payload: any):
        Observable<{ payload: FsDocuments }> {
        return this.doPost('downloadContract', payload) as Observable<{ payload: FsDocuments }>;
    }

}
