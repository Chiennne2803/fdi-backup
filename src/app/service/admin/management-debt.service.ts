import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsLoanProfilesDTO} from 'app/models/service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FsReportDebtDTO} from '../../models/service/FsReportDebtDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsReportDebtManagersDTO} from "../../models/service/FsReportDebtManagersDTO.model";


/**
 * quan ly cong no
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementDebtService extends BaseService {
    private drawer: MatDrawer;
    private _selectedProfile: BehaviorSubject<FsReportDebtManagersDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementDebt');
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                // this._prepareEmailConfig.next(res.payload as EmailConfigModel);
            })
        );
    }
    public initCreateReportDebt(payload?: FsReportDebtDTO): Observable<BaseResponse> {
        return this.doPost('initCreateReportDebt', payload);
    }
    public initCreateHistoryDebt(payload?: FsReportDebtDTO): Observable<BaseResponse> {
        return this.doPost('initCreateHistoryDebt', payload);
    }
    public viewHistoryNote(payload?: FsReportDebtDTO): Observable<BaseResponse> {
        return this.doPost('viewHistoryNote', payload);
    }
    public viewHistoryProcess(payload?: FsReportDebtDTO): Observable<BaseResponse> {
        return this.doPost('viewHistoryProcess', payload);
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    toggleDetailDrawer(): void {
        this.drawer.toggle();
    }

    openDetailDrawer(): void {
        this.drawer.open();
    }

    closeDetailDrawer(): void {
        this.drawer.close();
    }

    get selectedProfile$(): Observable<FsLoanProfilesDTO> {
        return this._selectedProfile.asObservable();
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
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsReportDebtManagersDTO = new FsReportDebtManagersDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._selectedProfile.next(res.payload);
            })
        );
    }

    /**
     * doCreate
     *
     * @param payload
     */
    doCreate(payload: FsReportDebtDTO = new FsReportDebtDTO()):
        Observable<BaseResponse> {
        return super.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    createDebtHistory(payload):
        Observable<BaseResponse> {
        return this.doPost('createDebtHistory', payload);
    }
}
