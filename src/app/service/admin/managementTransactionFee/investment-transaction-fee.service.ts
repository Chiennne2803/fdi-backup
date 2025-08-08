import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsTranferWalletReqDTO} from '../../../models/service/FsTranferWalletReqDTO.model';
import {BaseService} from '../../base-service';
import {FuseAlertService} from "../../../../@fuse/components/alert";

/**
 * phi giao dich dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class InvestmentTransactionFeeService extends BaseService {
    private drawer: MatDrawer;
    private _selectedDetail: BehaviorSubject<FsTranferWalletReqDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'transactionFee/investmentTransactionFee');
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
     * phi giao dich dau tu
     *
     * @param payload
     */
    searchInvestmentTransactionFee(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchInvestmentTransactionFee', payload);
    }
    /**
     * phi giao dich dau tu
     *
     * @param payload
     */
    searchInvestmentTransactionFeeReq(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('searchInvestmentTransactionFeeReq', payload);
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
