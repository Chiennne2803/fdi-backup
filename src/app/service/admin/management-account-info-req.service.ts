import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsAccountInfoReqDTO} from '../../models/service/FsAccountInfoReqDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * yeu cau thay doi ID/GPKD
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementAccountInfoReqService extends BaseService {
    public _search: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    private _selectedAccountInfo: BehaviorSubject<FsAccountInfoReqDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementAccountInfoReq');
    }

    get selectedProfile$(): Observable<FsAccountInfoReqDTO> {
        return this._selectedAccountInfo.asObservable();
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
     * search
     *
     * @param payload
     */
    search(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload).pipe(
            tap((res) => {
                this._search.next(res);
            })
        );
    }

    /**
     * approvalChangeInfoReq
     *
     * @param payload
     */
    approvalChangeInfoReq(payload: FsAccountInfoReqDTO = new FsAccountInfoReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('approvalChangeInfoReq', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsAccountInfoReqDTO = new FsAccountInfoReqDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._selectedAccountInfo.next(res.payload);
            })
        );
    }
}
