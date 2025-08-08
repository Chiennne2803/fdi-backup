import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTranspayInvestorDTO, FsTranspayReqDTO} from '../../models/service';
import {AdmAccountDetailDTO} from '../../models/admin';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * xu ly giao dich hoan tra nha dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class TranspayInvestorTransactionService extends BaseService {
    private _lstAccountApproval: BehaviorSubject<AdmAccountDetailDTO[]> = new BehaviorSubject<AdmAccountDetailDTO[]>(null);
    private _loanProfiles: BehaviorSubject<FsLoanProfilesDTO[]> = new BehaviorSubject<FsLoanProfilesDTO[]>(null);

    public _transpayInvestor$: BehaviorSubject<FsTranspayInvestorDTO> = new BehaviorSubject<FsTranspayInvestorDTO>(null);
    private _isShowDetail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'transpayInvestorTransaction');
    }

    get isShowDetail$(): Observable<boolean> {
        return this._isShowDetail.asObservable();
    }

    public showDetail(isShowDetail): any {
        this._isShowDetail.next(isShowDetail);
    }

    get transpayInvestor$(): Observable<FsTranspayInvestorDTO> {
        return this._transpayInvestor$.asObservable();
    }

    get lstAccountApproval$(): Observable<AdmAccountDetailDTO[]> {
        return this._lstAccountApproval.asObservable();
    }

    get loanProfiles$(): Observable<FsLoanProfilesDTO[]> {
        return this._loanProfiles.asObservable();
    }

    public prepare(): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._lstAccountApproval.next(res.payload?.lstAccountApproval);
            })
        );
    }

    /**
     * doSearchDraftTransaction
     *
     * @param payload
     */
    doSearchDraftTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('draftTransaction', payload);
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
     * doSearchProcessedTransaction
     *
     * @param payload
     */
    doSearchProcessedTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('processedTransaction', payload);
    }

    /**
     * doSearchLoanProfileDisbursement
     *
     * @param payload
     */
    doSearchLoanProfileDisbursement(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileDisbursement', payload);
    }

    /**
     * approvalTranspayInvestor
     * phe duyet giao dich hoan tra
     *
     * @param payload
     */
    approvalTranspayInvestor(payload: any):
        Observable<BaseResponse> {
        return this.doPost('approvalTranspayInvestor', payload);
    }

    /**
     * doSignTranspayPay
     * trinh ky yeu cau hoan tra
     *
     * @param payload
     */
    doSignTranspayPay(payload: FsTranspayInvestorDTO = new FsTranspayInvestorDTO()):
        Observable<BaseResponse> {
        return this.doPost('doSignTranspayPay', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: any):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap(res => this._transpayInvestor$.next(res.payload))
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    create(payload: FsTranspayInvestorDTO = new FsTranspayInvestorDTO()):
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
     * getLoanProfiles
     *
     * @param payload
     */
    getLoanProfiles(): Observable<BaseResponse> {
        return this.doPost('getLoanProfiles', {}).pipe(
            tap((res) => {
                this._loanProfiles.next(res.payload.lstLoanProfiles);
            }));
    }
    /**
     * getCardDownByLoanProfile
     *
     * @param payload
     */
    getCardDownByLoanProfile(fsLoanProfilesId: number): Observable<BaseResponse> {
        const payload = {
            fsLoanProfilesId: fsLoanProfilesId,
        };
        return this.doPost('getCardDownByLoanProfile', payload);
    }

    /**
     * getCardDownInvestorByCardDown
     *
     * @param payload
     */
    getFsTranspayReqByCardDown(fsCardDown: FsCardDownDTO): Observable<BaseResponse> {
        return this.doPost('getFsTranspayReqByCardDown', fsCardDown);
    }
    /**
     * getCardDownInvestorByCardDown
     *
     * @param payload
     */
    initTranspayInvestor(fsTranspayInvestorDTO: FsTranspayInvestorDTO): Observable<BaseResponse> {
        return this.doPost('initTranspayInvestor', fsTranspayInvestorDTO).pipe(
            tap(res => {
                if (res.errorCode === '0') {
                    this._transpayInvestor$.next(res.payload);
                }
            }
        ));
    }

    /**
     * transpayInvestorTransaction
     *
     * @param payload
     */
    transpayInvestorTransaction(payload: any): Observable<BaseResponse> {
        return this.doPost('', payload);
    }
}
