import {Injectable} from '@angular/core';
import {BaseService} from '../../base-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseRequest, BaseResponse} from '../../../models/base';
import {FuseAlertService} from "../../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class ReportInvestService extends BaseService {
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'report-invest');
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

}
