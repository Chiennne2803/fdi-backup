import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BaseService} from '../base-service';
import {Observable} from 'rxjs';
import {SpNotificationDTO} from '../../models/service/SpNotificationDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";


/**
 * notification
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService extends BaseService {


    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'notification');
    }


    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: SpNotificationDTO = new SpNotificationDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }


    /**
     * update
     *
     * @param payload
     */
    update(payload: SpNotificationDTO = new SpNotificationDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }


    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload);
    }
}
