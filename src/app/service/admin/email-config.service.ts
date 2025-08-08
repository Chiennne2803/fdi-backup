import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import {SpEmailConfigDTO} from 'app/models/service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class EmailConfigService extends BaseService {
    private _prepareEmailConfig: BehaviorSubject<SpEmailConfigDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'emailConfig');
    }

    /**
     * Getter for parent category list
     */
    get emailConfig$(): Observable<SpEmailConfigDTO> {
        return this._prepareEmailConfig.asObservable();
    }

    public prepareEmailConfig(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepareEmailConfig.next(res.payload as SpEmailConfigDTO);
            })
        );
    }

    public updateEmailConfig(payload: SpEmailConfigDTO = new SpEmailConfigDTO()): Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
