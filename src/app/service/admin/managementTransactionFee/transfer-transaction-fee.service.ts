import {HttpClient} from '@angular/common/http';
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsTranferWalletReqDTO} from '../../../models/service/FsTranferWalletReqDTO.model';
import {BaseService} from '../../base-service';

/**
 * Phi giao dich chuyen nhuong
 */
@Injectable({
    providedIn: 'root'
})
export class TransferTransactionFeeService extends BaseService {
    private drawer: MatDrawer;
    private _selectedDetail: BehaviorSubject<FsTranferWalletReqDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'transactionFee/transferTransactionFee');
    }

    get selectedProfile$(): Observable<FsTranferWalletReqDTO> {
        return this._selectedDetail.asObservable();
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
        return this.prepareLoadingPage();
    }

    /**
     * Phi giao dich chuyen nhuong
     *
     * @param payload
     */
    searchTransferTransactionFee(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchTransferTransactionFee', payload);
    }
    /**
     * Phi giao dich chuyen nhuong
     *
     * @param payload
     */
    searchTransferTransactionFeeReq(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchTransferTransactionFeeReq', payload);
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
                this._selectedDetail.next(res.payload);
            })
        );
    }
    /**
     * doSignReq
     *
     * @param payload
     */
    doSignReq(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('doSignReq', payload);
    }
    /**
     * initTranferWalletReq
     *
     * @param payload
     */
    initTranferWalletReq(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('initTranferWalletReq', payload);
    }
    /**
     * getDetail
     *
     * @param payload
     */
    create(payload: FsTranferWalletReqDTO = new FsTranferWalletReqDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }
    delete(condition: any): Observable<BaseResponse> {
        return this.doDelete(condition);
    }
}
