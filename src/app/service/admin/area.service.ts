import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmCategoriesDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * quan ly danh muc
 */
@Injectable({
    providedIn: 'root'
})
export class AreaService extends BaseService {
    public _allProvince: BehaviorSubject<Array<AdmCategoriesDTO>> = new BehaviorSubject(null);
    private _parentCategories: BehaviorSubject<AdmCategoriesDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'area');
    }

    /**
     * Getter for parent category list
     */
    get parentCategories$(): Observable<AdmCategoriesDTO> {
        return this._parentCategories.asObservable();
    }

    /**
     * Getter for category list
     */
    // get categories$(): Observable<BaseResponse> {
    //     return this._categories.asObservable();
    // }

    /**
     * Getter for category list
     */
    get allProvinces$(): Observable<Array<AdmCategoriesDTO>> {
        return this._allProvince.asObservable();
    }


    /**
     * doSearch
     *
     * @param payload
     */
    doSearchProvince(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doSearchAllProvince', payload);
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearchDistrict(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doSearchAllDistrict', payload);
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearchCommune(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('doSearchAllCommune', payload);
    }


    /**
     * getAllProvince
     *
     * @param payload
     */
    getAllProvince(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doGet('getAllProvince').pipe(
            tap((res: BaseResponse) => {
                this._allProvince.next(res.payload);
            })
        );
    }

    /**
     * getAllByParentCategoriesCode
     *
     * @param payload
     */
    getAllByParentCategoriesCode(payload: any):
        Observable<BaseResponse> {
        return this.doGet('getAllByParentCategoriesCode?parentCategoriesCode=' + payload);
    }

    /**
     * getDetailByCode
     *
     * @param payload
     */
    getDetailByCode(payload: any):
        Observable<BaseResponse> {
        return this.doGet('getDetailByCode?categoriesCode=' + payload);
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * update
     *
     * @param payload
     */
    update(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
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
    getDetail(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload);
    }


    /**
     * getParentCategories
     *
     * @param payload
     */
    getParentCategories(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._parentCategories.next(res.payload);
            })
        );
    }
}
