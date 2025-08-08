import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO, AdmDepartmentsDTO, DeparmentPrepareObject} from 'app/models/admin';
import {BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";


/**
 * Quan ly nha dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class ManagementStaffService extends BaseService {
    public _prepareStaff: BehaviorSubject<AdmAccountDetailDTO> = new BehaviorSubject(null);
    public _prepareDepartment: BehaviorSubject<DeparmentPrepareObject> = new BehaviorSubject(null);
    public _staffDetail: BehaviorSubject<AdmAccountDetailDTO> = new BehaviorSubject(null);
    public _departmentDetail: BehaviorSubject<AdmDepartmentsDTO> = new BehaviorSubject(null);
    public _departments: BehaviorSubject<Array<AdmDepartmentsDTO>> = new BehaviorSubject(null);
    private _staff: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'managementStaff');
    }

    /**
     * Getter for staff detail
     */
    get staffDetail$(): Observable<AdmAccountDetailDTO> {
        return this._staffDetail.asObservable();
    }

    /**
     * Getter for Staff list
     */
    get staffs$(): Observable<BaseResponse> {
        return this._staff.asObservable();
    }

    /**
     * Setter for staff detail
     */
    set staffDetail(staff: AdmAccountDetailDTO) {
        this._staffDetail.next(staff);
    }

    public getPrepareLoadingPage(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe();
    }

    /**
     * doSeach
     *
     * @param payload
     */
    doSearch(payload = {}):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload).pipe(
            tap((res) => {
                this._staff.next(res);
            })
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._staffDetail.next(res.payload);
            })
        );
    }

    createNewDetail() {
        this._staffDetail.next(undefined);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    create(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    update(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
    /**
     * deleteMethod
     *
     * @param payload
     */
    deleteMethod(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.doDelete(payload);
    }

    /**
     * changePass
     *
     * @param payload
     */
    changePass(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.doPost('changePass', payload);
    }


}
