import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FsChargeCashReqDTO} from '../../models/service/FsChargeCashReqDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * thanh toan hoa hong
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementBonusService extends BaseService {
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

    get prepareManageBonus$(): Observable<any> {
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
            tap((res: BaseResponse) => {
                this._prepare.next(res.payload);
            })
        );
    }


    /**
     * getListTransaction
     *
     * @param payload
     */
    getListTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getListTransaction', payload);
    }

    /**
     * getChargeCashReq
     *
     * @param payload
     */
    getChargeCashReq(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getChargeCashReq', payload);
    }

    /**
     * initChargeCashReq
     *
     * @param payload
     */
    initChargeCashReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('initChargeCashReq', payload);
    }

    /**
     * doSignReq
     *
     * @param payload
     */
    doSignReq(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doPost('doSignReq', payload);
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
    create(payload: FsChargeCashReqDTO = new FsChargeCashReqDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    deleteBonusFee(condition: any): Observable<BaseResponse>{
        return this.doPost('deleteBonusFee', condition);
    }
}
