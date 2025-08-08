import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsChargeCashReqDTO} from '../../models/service/FsChargeCashReqDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * xu ly yeu cau thanh toan hoa hong
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementBonusReqService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    private drawer: MatDrawer;
    private _selectedChargeCashReq: BehaviorSubject<FsChargeCashReqDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementBonusReq');
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
     * getApprovalChargeCashReq
     *
     * @param payload
     */
    getApprovalChargeCashReq(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getApprovalChargeCashReq', payload);
    }

    /**
     * approvalChargeCashReq
     *
     * @param payload
     */
    approvalChargeCashReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('approvalChargeCashReq', payload);
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
     * getDetail
     *
     * @param payload
     */
    create(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }
}
