import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {ProcessScheduler} from "../../modules/admin/process-config/process-config.config";
import {AdmProcessConfigDTO} from "../../models/admin/AdmProcessConfigDTO.model";

/**
 * cau hinh process
 */
@Injectable({
    providedIn: 'root'
})
export class AdmProcessConfigService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'processConfig');
    }

    public prepare(): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepare.next(res);
            })
        );
    }

    public getLog(keyLog: string): Observable<BaseResponse> {
        let payload: BaseRequest = new BaseRequest()
        payload.key = keyLog
        return this.doPost('getlog', payload);
    }

    public updateProcess(admConfigProcessDTO: AdmProcessConfigDTO): Observable<BaseResponse> {
        return this.doPost('updateProcess', admConfigProcessDTO);
    }
}
