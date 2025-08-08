import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsConfBonusDTO} from '../../models/admin/FsConfBonusDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsConfRefundDTO} from "../../models/service/FsConfRefundDTO.model";

/**
 * cau hinh hoa hong
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigBonusService extends BaseService {
    public _confBonus: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    public _confBonusDetail: BehaviorSubject<FsConfBonusDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'configService/configBonus');
    }

    get confBonusDetail$(): Observable<FsConfBonusDTO> {
        return this._confBonusDetail.asObservable();
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload).pipe(
            tap((res) => {
                this._confBonus.next(res);
            })
        );
    }


    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsConfBonusDTO = new FsConfBonusDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._confBonusDetail.next(res.payload);
            })
        );
    }


    /**
     * doCreate
     *
     * @param payload
     */
    create(payload: FsConfBonusDTO = new FsConfBonusDTO()): Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: FsConfBonusDTO = new FsConfBonusDTO()): Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
