import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {AdmValuationHistoryDTO} from "../../models/admin/AdmValuationHistoryDTO.model";


/**
 * Quan ly nguoi huy dong von
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementLenderService extends BaseService {
    private drawer: MatDrawer;
    public _lenders: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    public _prepareLender: BehaviorSubject<any> = new BehaviorSubject(null);
    private _detail: BehaviorSubject<AdmAccountDetailDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementLender');
    }

    get prepareLender$(): Observable<any> {
        return this._prepareLender.asObservable();
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepareLender.next(res.payload);
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

    get detail$(): Observable<AdmAccountDetailDTO> {
        return this._detail.asObservable();
    }

    get prepare$(): Observable<any> {
        return this._prepareLender.asObservable();
    }

    /**
     * doSeach
     *
     * @param payload
     */
    doSearch(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload).pipe(
            tap((res) => {
                this._lenders.next(res);
            })
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload?: any, tabIndex?: string):
        Observable<BaseResponse> {
        return super.doGetDetail(payload || { admAccountDetailId: this._detail.value.admAccountDetailId }).pipe(
            tap((res) => {
                let adm = res.payload as AdmAccountDetailDTO;
                adm.tabIndex = tabIndex;
                this._detail.next(adm);
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

    update(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    /**
     * approvalLender
     * @param payload
     */
    approvalLender(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('approvalLender', payload);
    }

    updateDeputyContact(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('updateDeputyContact', payload);
    }

    /**
     * setManageStaff
     *
     * @param payload
     */
    setManageStaff(payload):
        Observable<BaseResponse> {
        return this.doPost('setManageStaff', payload);
    }

    createOrUpdateCollateral(payload):
        Observable<BaseResponse> {
        return this.doPost('createOrUpdateCollateral', {...payload, admAccountId: this._detail.value.admAccountId});
    }
    createCollateralHistory(payload):
        Observable<BaseResponse> {
        return this.doPost('createCollateralHistory', {...payload, admAccountId: this._detail.value.admAccountId});
    }

    createOrUpdateCreditLimit(payload):
        Observable<BaseResponse> {
        return this.doPost('createOrUpdateCreditLimit', {...payload, admAccountId: this._detail.value.admAccountId});
    }
    updateCustomerRank(payload):
        Observable<BaseResponse> {
        return this.doPost('updateCustomerRank', {...payload, admAccountId: this._detail.value.admAccountId});
    }

    getValuationHistory(payload): Observable<BaseResponse> {
        return this.doPost('getValuationHistory', payload);
    }
}
