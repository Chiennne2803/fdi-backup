import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from '../../../@fuse/components/alert';
import {AdmActionDetailDTO} from '../../models/admin/AdmActionDetailDTO.model';


/**
 *
 */
@Injectable({
    providedIn: 'root'
})
export class AdmActionDetailService extends BaseService {
    private detailDrawer: MatDrawer;
    private _selected: BehaviorSubject<AdmActionDetailDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'accessMonitoring');
    }

    get selected$(): Observable<AdmActionDetailDTO> {
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

    doGetActionDetail(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doGetActionDetail', payload);
    }
}
