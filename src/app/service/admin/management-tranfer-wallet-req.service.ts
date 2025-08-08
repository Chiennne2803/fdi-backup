import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsTranferWalletReqDTO} from '../../models/service/FsTranferWalletReqDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * xu ly yeu cau dieu chuyen tien vi
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementTranferWalletReqService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    private _selectedChargeCashReq: BehaviorSubject<FsTranferWalletReqDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementTranferWalletReq');
    }

    get selectedProfile$(): Observable<FsTranferWalletReqDTO> {
        return this._selectedChargeCashReq.asObservable();
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
            })
        );
    }

    /**
     * Phi thu xep khoan vay
     *
     * @param payload
     */
    searchLoanArrangementFee(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchLoanArrangementFee', payload);
    }

    /**
     * Phi quan ly tai khoan
     *
     * @param payload
     */
    searchAccountManagementFee(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchAccountManagementFee', payload);
    }

    /**
     * Phi giao dich chuyen nhuong
     *
     * @param payload
     */
    searchTransferTransactionFee(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchTransferTransactionFee', payload);
    }


    /**
     * phi giao dich dau tu
     *
     * @param payload
     */
    searchInvestmentTransactionFee(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchInvestmentTransactionFee', payload);
    }

    /**
     * phi giao dich nap tien
     *
     * @param payload
     */
    searchDepositTransactionFee(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchDepositTransactionFee', payload);
    }

    /**
     * phi giao dich rut tien
     *
     * @param payload
     */
    searchWithdrawalTransactionFee(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchWithdrawalTransactionFee', payload);
    }

    /**
     * Thue thu nhap ca nhan
     *
     * @param payload
     */
    searchPersonalIncomeTax(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchPersonalIncomeTax', payload);
    }

    /**
     * Lai qua han
     *
     * @param payload
     */
    searchOverdueInterest(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchOverdueInterest', payload);
    }


    /**
     * approvalTranferWalletReq
     *
     * @param payload
     */
    approvalTranferWalletReq(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('approvalTranferWalletReq', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._selectedChargeCashReq.next(res.payload);
            })
        );
    }
}
