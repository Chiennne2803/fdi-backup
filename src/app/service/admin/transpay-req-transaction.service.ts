import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {
    FsLoanProfilesDTO,
    FsTopupMailTransferDTO,
    FsTranspayReqDTO,
    PrepareLoadingPageTrans
} from '../../models/service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * xu ly giao dich thanh toan khoan vay
 */
@Injectable({
    providedIn: 'root'
})
export class TranspayReqTransactionService extends BaseService {
    private _prepare: BehaviorSubject<PrepareLoadingPageTrans> = new BehaviorSubject<PrepareLoadingPageTrans>(null);
    private _loanProfiles: BehaviorSubject<FsLoanProfilesDTO[]> = new BehaviorSubject<FsLoanProfilesDTO[]>(null);
    private _transPayReqDetail: BehaviorSubject<FsTranspayReqDTO> = new BehaviorSubject<FsTranspayReqDTO>(null);
    private _isShowDetail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'transpayReqTransaction');
    }

    get loanProfiles$(): Observable<FsLoanProfilesDTO[]> {
        return this._loanProfiles.asObservable();
    }
    get isShowDetail$(): Observable<boolean> {
        return this._isShowDetail.asObservable();
    }

    public showDetail(isShowDetail): any {
        this._isShowDetail.next(isShowDetail);
    }

    get transPayReqDetail$(): Observable<FsTranspayReqDTO> {
        return this._transPayReqDetail.asObservable();
    }

    /**
     * prepare
     *
     * @param payload
     */
    public prepare(): Observable<PrepareLoadingPageTrans> {
        return this.prepareLoadingPage().pipe(
            tap((res) => {
                this._prepare.next(res.payload);
                this._loanProfiles.next(res.payload?.loanProfiles);
            })
        );
    }

    /**
     * transpayReqTransaction
     *
     * @param payload
     */

    transpayReqTransaction(payload: FsTranspayReqDTO = new FsTranspayReqDTO()): Observable<BaseResponse> {
        return this.searchDataLazyLoad('', payload);
    }
    /**
     * doSearchWaitPayTransaction
     *
     * @param payload
     */
    doSearchWaitPayTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitPayTransaction', payload);
    }

    /**
     * doSearchWaitProcessTransaction
     *
     * @param payload
     */
    doSearchWaitProcessTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitProcessTransaction', payload);
    }

    /**
     * doSearchWaitApproveTransaction
     *
     * @param payload
     */
    doSearchWaitApproveTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitApproveTransaction', payload);
    }

    /**
     * doSearchProcessedTransaction
     *
     * @param payload
     */
    doSearchProcessedTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('processedTransaction', payload);
    }

    /**
     * doSearchErrorTransaction
     *
     * @param payload
     */
    doSearchErrorTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('errorTransaction', payload);
    }

    /**
     * doSearchTimeoutTransaction
     *
     * @param payload
     */
    doSearchTimeoutTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('timeoutTransaction', payload);
    }

    /**
     * doSearchProgressingTranspayReqError
     *
     * @param payload
     */
    progressingTranspayReqError(payload: any): Observable<BaseResponse> {
        return this.doPost('progressingTranspayReqError', payload);
    }

    /**
     * approvalApprovalTranspayReq
     * phe duyet giao dich thanh toan khoan vay
     *
     * @param payload
     */
    approvalApprovalTranspayReq(payload: any): Observable<BaseResponse> {
        return this.doPost('approvalTranspayReq', payload);
    }

    /**
     * getDetailErrorTrans
     *
     * @param payload
     */
    getDetailErrorTrans(payload: FsTopupMailTransferDTO = new FsTopupMailTransferDTO()):
        Observable<BaseResponse> {
        return this.doPost('getDetailErrorTrans', payload).pipe(
            tap(res => this._transPayReqDetail.next(res.payload))
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsTranspayReqDTO = new FsTranspayReqDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap(res => this._transPayReqDetail.next(res.payload)),
        );
    }
    /**
     * getDetail
     *
     * @param payload
     */
    create(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * deleteMethod
     *
     * @param payload
     */
    deleteMethod(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doDelete(payload);
    }

    /**
     * getCardDownByLoanProfile
     *
     * @param payload
     */
    getCardDownByLoanProfile(fsLoanProfilesId: number): Observable<BaseResponse> {
        const payload = {
            fsCardownDetailId: null,
            fsLoanProfilesId: fsLoanProfilesId,
            fsTranspayPeriodId: null
        };
        return this.doPost('getCardDownByLoanProfile', payload);
    }

    /**
     * initTranspayReq
     *
     * @param payload
     */
    initTranspayReq(fsTranspayReqDTO: FsTranspayReqDTO): Observable<BaseResponse> {
        return this.doPost('initTranspayReq', fsTranspayReqDTO);
    }

    public cancelRequest(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/cancelRequest', payload);
    }
}
