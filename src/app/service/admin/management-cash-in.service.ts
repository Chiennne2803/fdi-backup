import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsChargeCashReqDTO} from '../../models/service/FsChargeCashReqDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * tiep quy tien mat/ tien dien tu
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementCashInService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    private _selectedChargeCashReq: BehaviorSubject<FsChargeCashReqDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementCashInReq');
    }
    get prepare$(): Observable<BaseResponse> {
        return this._prepare.asObservable();
    }
    get selectedProfile$(): Observable<FsChargeCashReqDTO> {
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
     * danh sach yeu cau
     *
     * @param payload
     */
    doSearch(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * initChargeCashReq
     *
     * @param payload
     */
    initCashInReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('initCashInReq', payload);
    }

    /**
     * doSignCashInReq
     *
     * @param payload
     */
    doSignCashInReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('doSignCashInReq', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._selectedChargeCashReq.next(res.payload);
            })
        );
    }

    /**
     * tao moi yeu cau
     *
     * @param payload
     */
    create(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }
}
