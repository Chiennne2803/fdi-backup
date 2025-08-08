import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {ProcessScheduler} from "../../modules/admin/process-config/process-config.config";
import {AdmProcessConfigDTO} from "../../models/admin/AdmProcessConfigDTO.model";

/**
 *
 */
@Injectable({
    providedIn: 'root'
})
export class SyncMemoryService extends BaseService {

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, null, 'syncMemory');
    }

    public sync(): Observable<BaseResponse> {
        return this.doPost('sync', {});
    }

    public syncConfig(): Observable<BaseResponse> {
        return this.doPost('syncConfig', {});
    }
}
