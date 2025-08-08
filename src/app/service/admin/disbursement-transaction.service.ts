import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTransInvestorDTO} from 'app/models/service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {MatDrawer} from "@angular/material/sidenav";
import {FsCardDownInvestorDTO} from "app/models/service/FsCardDownInvestorDTO.model";
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsTranferWalletReqDTO} from "../../models/service/FsTranferWalletReqDTO.model";

/**
 * xu ly giao dich giai ngan
 */
@Injectable({
    providedIn: 'root'
})
export class DisbursementTransactionService extends BaseService {
    private drawer: MatDrawer;
    private _selectDisbursement: BehaviorSubject<{fsCardDown: FsCardDownDTO; fsLoanProfiles: FsLoanProfilesDTO; investors: FsCardDownInvestorDTO[]}> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'disbursementTransaction');
    }

    /**
     * Lap yeu cau giai ngan. step 1 init
     * prepareLoadingPage
     * @param request
     */
    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                // this._prepareEmailConfig.next(res.payload as EmailConfigModel);
            })
        );
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    toggleDetailDrawer(): void {
        this.drawer.toggle();
    }

    openDetailDrawer(): void {
        this.drawer.open();
    }

    closeDetailDrawer(): void {
        this.drawer.close();
    }

    get selectDisbursement$(): Observable<{fsCardDown: FsCardDownDTO; fsLoanProfiles: FsLoanProfilesDTO; investors: FsCardDownInvestorDTO[]}> {
        return this._selectDisbursement.asObservable();
    }

    /**
     * draftTransaction
     *
     * @param payload
     */
    draftTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('draftTransaction', payload);
    }

    /**
     * waitProcessTransaction
     *
     * @param payload
     */
    waitProcessTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitProcessTransaction', payload);
    }

    /**
     * successTransaction
     *
     * @param payload
     */
    successTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('successTransaction', payload);
    }

    /**
     * doSignProcess
     *
     * @param payload
     */
    doSignProcess(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('doSignProcess', payload);
    }

    /**
     * approvalCardDown
     *
     * @param payload
     */
    approvalCardDown(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('approvalCardDown', payload);
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
                this._selectDisbursement.next(res.payload);
            })
        );
    }

    /**
     * Lap yeu cau giai ngan. step 2 init
     * initInvestorTimeStart
     *
     * @param payload
     */
    getInvestorTimeStart(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return this.doPost('getInvestorTimeStart', payload);
    }
    /**
     * Lap yeu cau giai ngan. step 2 init
     * initInvestorTimeStart
     *
     * @param payload
     */
    getTransInvestor(payload: FsTransInvestorDTO = new FsTransInvestorDTO()):
        Observable<BaseResponse> {
        return this.doPost('getTransInvestor', payload);
    }

    /**
     * prepareDisbursementRequest
     *
     * @param payload
     */
    prepareDisbursementRequest(payload: FsTransInvestorDTO = new FsTransInvestorDTO()):
        Observable<BaseResponse> {
        return this.doPost('prepareDisbursementRequest', payload);
    }

    /**
     * createDisbursementRequest
     *
     * @param payload
     */
    createDisbursementRequest(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('createDisbursementRequest', payload);
    }
}
