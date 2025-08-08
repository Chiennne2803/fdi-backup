import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsTransWithdrawCashDTO} from '../../models/service/FsTransWithdrawCashDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * yeu cau rut tien HO
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementWithdrawHOReqService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    private _selectedDetail: BehaviorSubject<FsTransWithdrawCashDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'withdrawHO');
    }

    get selectedProfile$(): Observable<FsTransWithdrawCashDTO> {
        return this._selectedDetail.asObservable();
    }
    get prepare$(): Observable<BaseResponse> {
        return this._prepare.asObservable();
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
     * danh sach yeu cau cho xu ly
     *
     * @param payload
     */
    waitProcessTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitProcessTransaction', payload);
    }

    /**
     * approvalWithdrawReq
     *
     * @param payload
     */
    approvalWithdrawReq(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return this.doPost('approvalWithdrawReq', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._selectedDetail.next(res.payload);
            })
        );
    }
}
