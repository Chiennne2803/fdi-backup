import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsTopupMailTransferDTO} from '../../models/service';
import {FsChargeCashReqDTO} from '../../models/service/FsChargeCashReqDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * xu ly yeu cau tiep quy
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementCashInReqService extends BaseService {
    private drawer: MatDrawer;
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _selectedChargeCashReq: BehaviorSubject<FsChargeCashReqDTO> = new BehaviorSubject(null);
    public showDetail: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementCashInReq');
    }

    get selectedProfile$(): Observable<FsChargeCashReqDTO> {
        return this._selectedChargeCashReq.asObservable();
    }
    get getPrepare$(): Observable<BaseResponse> {
        return this._prepare.asObservable();
    }
    get getShowDetail$(): Observable<boolean> {
        return this.showDetail.asObservable();
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

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res) => {
                this._prepare.next(res);
                this.showDetail.next(false);
            })
        );
    }

    /**
     * cho xu ly
     *
     * @param payload
     */
    getCashInReqWaitingProgressing(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getCashInReqWaitingProgressing', payload);
    }

    /**
     * gia odich loi
     * return FsTopupMailTransferDTO
     *
     * @param payload
     */
    getCashInReqError(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getCashInReqError', payload);
    }

    /**
     * giao dich thanh cong
     *
     * @param payload
     */
    getCashInReqApproval(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getCashInReqApproval', payload);
    }

    /**
     * approvalCashInReq
     *
     * @param payload
     */
    approvalCashInReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('approvalCashInReq', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._selectedChargeCashReq.next(res.payload);
            })
        );
    }
    /**
     * getDetailError
     *
     * @param payload
     */
    getDetailError(payload: FsTopupMailTransferDTO = new FsTopupMailTransferDTO()):
        Observable<BaseResponse> {
        return super.doPost('getDetailError', payload);
    }
    /**
     * processErrorReq
     *
     * @param payload
     */
    processErrorReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return super.doPost('processErrorReq', payload);
    }

    setShowDetail(display: boolean) {
        this.showDetail.next(display);
    }
}
