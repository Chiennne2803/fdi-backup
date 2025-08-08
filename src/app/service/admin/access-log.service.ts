import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTopupMailTransferDTO} from 'app/models/service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {AdmAccessLogDTO} from "../../models/admin/AdmAccessLogDTO.model";
import {FuseAlertService} from "../../../@fuse/components/alert";


/**
 * log truy cap
 */
@Injectable({
    providedIn: 'root'
})
export class AdmAccessLogService extends BaseService {
    private detailDrawer: MatDrawer;
    private _selected: BehaviorSubject<AdmAccessLogDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'accessMonitoring');
    }

    get selected$(): Observable<AdmAccessLogDTO> {
        return this._selected.asObservable();
    }

    setDrawer(drawer: MatDrawer): void {
        this.detailDrawer = drawer;
    }

    toggleDetailDrawer(): void {
        this.detailDrawer.toggle();
    }

    openDetailDrawer(): void {
        this.detailDrawer.open();
    }

    closeDetailDrawer(): void {
        this.detailDrawer.close();
    }

    /**
     * doSearchErrorTransaction
     *
     * @param payload
     */
    doSearchAccessLogStaff(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doSearchAccessLogStaff', payload);
    }

    /**
     * doSearchSuccessTransaction
     *
     * @param payload
     */
    doSearchAccessLogInvestor(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doSearchAccessLogInvestor', payload);
    }
    /**
     * doSearchSuccessTransaction
     *
     * @param payload
     */
    doSearchAccessLogLender(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doSearchAccessLogLender', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._selected.next(res.payload);
            })
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    update(payload: FsTopupMailTransferDTO = new FsTopupMailTransferDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
