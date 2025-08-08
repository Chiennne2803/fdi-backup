import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TableConfigDTO} from 'app/models/TableConfigDTO.model';
import {Observable} from 'rxjs';
import {BaseRequest, BaseResponse} from '../../models/base';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class CommonService extends BaseService {

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'common');
    }

    /**
     * Getter for getListTenor
     */
    get getListTenor(): Observable<BaseResponse> {
        return this.doGet('getListTenor');
    }

    saveTableConfig(payload: TableConfigDTO = new TableConfigDTO()):
        Observable<BaseResponse> {
        return this.doPost('saveTableConfig', payload);
    }

    loadTableConfig(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('loadTableConfig', payload);
    }

}
