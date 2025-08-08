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
export class CategoriesService extends BaseService {
    public _allProvince: BehaviorSubject<Array<AdmCategoriesDTO>> = new BehaviorSubject(null);
    public _allDistrict: BehaviorSubject<Array<AdmCategoriesDTO>> = new BehaviorSubject(null);
    private _parentCategories: BehaviorSubject<Array<AdmCategoriesDTO>> = new BehaviorSubject(null);
    // private _categories: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _prepareCategory: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'categories');
    }

    /**
     * Getter for parent category list
     */
    get parentCategories$(): Observable<Array<AdmCategoriesDTO>> {
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
     * Getter for category list
     */
    get allDistrict$(): Observable<Array<AdmCategoriesDTO>> {
        return this._allDistrict.asObservable();
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
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
     * getAllDistrict
     *
     * @param payload
     */
    getAllDistrict(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doGet('getAllDistrict').pipe(
            tap((res: BaseResponse) => {
                this._allDistrict.next(res.payload);
            })
        );
    }

    /**
     * getAllCommune
     *
     * @param payload
     */
    getAllCommune(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doGet('getAllCommune');
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
     * parentAll
     *
     * @param payload
     */
    parentAll(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('parent/all', payload).pipe(
            tap((res) => {
                this._parentCategories.next(res.payload);
            })
        );
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
     * update
     *
     * @param payload
     */
    updateParrent(payload: AdmCategoriesDTO = new AdmCategoriesDTO()):
        Observable<BaseResponse> {
        return this.doPost('updateParrent', payload);
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
}
