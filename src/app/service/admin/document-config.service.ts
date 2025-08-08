import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {AdmDocumentConfigDTO} from '../../models/admin/AdmDocumentConfigDTO.model';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from "../../../@fuse/components/alert";
/**
 * cau hinh bieu mau
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentConfigService extends BaseService {
    private drawer: MatDrawer;
    private _configDetail: BehaviorSubject<AdmDocumentConfigDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'document-config');
    }

    get configDetail$(): Observable<AdmDocumentConfigDTO> {
        return this._configDetail.asObservable();
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
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: AdmDocumentConfigDTO = new AdmDocumentConfigDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._configDetail.next(res.payload);
            })
        );
    }


    /**
     * doCreate
     *
     * @param payload
     */
    create(payload: AdmDocumentConfigDTO = new AdmDocumentConfigDTO()): Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: AdmDocumentConfigDTO = new AdmDocumentConfigDTO()): Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
