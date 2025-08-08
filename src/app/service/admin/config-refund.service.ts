import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsConfRefundDTO} from '../../models/service/FsConfRefundDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * tuy chinh san pham tin dung/ giai ngan va hoan tra
 */
@Injectable({
    providedIn: 'root'
})
export class ConfRefundService extends BaseService {
    public _configRefund: BehaviorSubject<FsConfRefundDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'configService/configRefund');
    }

    get configRefund(): Observable<FsConfRefundDTO> {
        return this._configRefund.asObservable();
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._configRefund.next(res.payload);
            })
        );
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: FsConfRefundDTO = new FsConfRefundDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
