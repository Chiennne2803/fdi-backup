import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsConfRefundDTO} from "../../models/service/FsConfRefundDTO.model";

/**
 * Quan ly nha dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementInvestorService extends BaseService {
    private drawer: MatDrawer;
    public _prepareInvestor: BehaviorSubject<any> = new BehaviorSubject(null);
    public _investors: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _detail: BehaviorSubject<AdmAccountDetailDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementInvestor');
    }

    get prepareInvestor$(): Observable<any> {
        return this._prepareInvestor.asObservable();
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepareInvestor.next(res.payload);
            })
        );
    }

    get detail$(): Observable<AdmAccountDetailDTO> {
        return this._detail.asObservable();
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

    /**
     * doSeach
     *
     * @param payload
     */
    doSearch(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload).pipe(
            tap((res) => {
                this._investors.next(res);
            })
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    detail(payload: any):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res: BaseResponse) => {
                this._detail.next(res.payload as AdmAccountDetailDTO);
            })
        );
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    update(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    /**
     * approvalInvestor
     *
     * @param payload
     */
    approvalInvestor(payload):
        Observable<BaseResponse> {
        return this.doPost('approvalInvestor', {...payload, admAccountId: payload?.admAccountId || this._detail.value.admAccountId});
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
}
