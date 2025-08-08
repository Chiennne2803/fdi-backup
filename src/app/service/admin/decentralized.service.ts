import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {AdmGroupRoleDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {SpEmailConfigDTO} from "../../models/service";

/**
 * quan ly phong ban
 */
@Injectable({
    providedIn: 'root'
})
export class DecentralizedService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    public _admGroupRoleDetail: BehaviorSubject<AdmGroupRoleDTO> = new BehaviorSubject(null);
    public _initAvance: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'decentralized');
    }

    get admGroupRoleDetail$(): Observable<SpEmailConfigDTO> {
        return this._admGroupRoleDetail.asObservable();
    }
    get initAvance$(): Observable<BaseResponse> {
        return this._initAvance.asObservable();
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepare.next(res);
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

    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: AdmGroupRoleDTO = new AdmGroupRoleDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: AdmGroupRoleDTO = new AdmGroupRoleDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    /**
     * deleteMethod
     *
     * @param payload
     */
    deleteMethod(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doDelete(payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: AdmGroupRoleDTO = new AdmGroupRoleDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._admGroupRoleDetail.next(res.payload);
            })
        );
    }

    /**
     * initAdvanceTab
     * @param payload
     */
    initAdvanceTab(payload: AdmGroupRoleDTO = new AdmGroupRoleDTO()): Observable<BaseResponse> {
        return this.doPost('initAdvanceTab', payload).pipe(
            tap((res) => {
                this._initAvance.next(res);
            })
        );
    }
}
