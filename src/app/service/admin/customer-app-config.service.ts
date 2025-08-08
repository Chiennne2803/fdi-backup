import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsConfCreditDTO} from '../../models/service/FsConfCreditDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * cau hinh chuc nang khach hang
 */
@Injectable({
    providedIn: 'root'
})
export class CustomerAppConfigService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'customerAppConfig');
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
     * update
     *
     * @param payload
     */
    update(payload: FsConfCreditDTO = new FsConfCreditDTO()): Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

}
