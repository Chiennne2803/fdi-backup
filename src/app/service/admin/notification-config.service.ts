import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AdmAccountDetailDTO} from './../../models/admin/AdmAccountDetailDTO.model';
import {SpNotificationModuleDTO} from './../../models/service/SpNotificationModuleDTO.model';

import {BaseResponse} from 'app/models/base';

import {SpNotificationConfigDTO} from '../../models/service/SpNotificationConfigDTO.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {SpEmailConfigDTO} from "../../models/service";

/**
 * Quan ly nha dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationConfigService extends BaseService {
    public _notificationDetail: BehaviorSubject<SpNotificationConfigDTO> = new BehaviorSubject(null);
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'notificationConfig');
    }

    get prepare$(): Observable<BaseResponse> {
        return this._prepare.asObservable();
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepare.next(res);
            })
        );
    }

    /**
     * doSeach
     *
     * @param payload
     */
    doSearch(payload: SpNotificationConfigDTO = new SpNotificationConfigDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: SpNotificationConfigDTO = new SpNotificationConfigDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._notificationDetail.next(res.payload);
            })
        );
    }

    /**
     *
     *
     * @param payload
     */
    create(payload: SpNotificationConfigDTO = new SpNotificationConfigDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     *
     *
     * @param payload
     */
    update(payload: SpNotificationConfigDTO = new SpNotificationConfigDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
