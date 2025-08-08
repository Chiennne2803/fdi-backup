import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {AdmValuationHistoryDTO} from "../../models/admin/AdmValuationHistoryDTO.model";


/**
 * lich su dinh gia tai san
 */
@Injectable({
    providedIn: 'root'
})
export class AdmValuationHistoryService extends BaseService {
    public _prepareLender: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'valuationHistory');
    }


    /**
     * doSeach
     *
     * @param payload
     */
    doSearch(payload: AdmValuationHistoryDTO = new AdmValuationHistoryDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

}
