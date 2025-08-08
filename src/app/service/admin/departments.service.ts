import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO, AdmDepartmentsDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * quan ly phong ban
 */
@Injectable({
    providedIn: 'root'
})
export class DepartmentsService extends BaseService {
    public _departmentDetail: BehaviorSubject<AdmDepartmentsDTO> = new BehaviorSubject(null);
    public _listUser: BehaviorSubject<AdmAccountDetailDTO[]> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'AdmDepartments');
    }

    public getPrepareLoadingPage(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._listUser.next(res.payload.lstUser);
            })
        );
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


    /**
     * getAllActive
     *
     * @param payload
     */
    getAllActive(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('getAllActive', payload);
    }


    /**
     * create
     *
     * @param payload
     */
    create(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }

    /**
     * deleteMethod
     *
     * @param payload
     */
    deleteMethod(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doDelete(payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: AdmDepartmentsDTO = new AdmDepartmentsDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._departmentDetail.next(res.payload);
            })
        );
    }
}
