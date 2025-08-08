import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsCardDownDTO} from "../../models/service";
import {FuseAlertService} from "../../../@fuse/components/alert";
import {MatDrawer} from "@angular/material/sidenav";

/**
 * ho so dang xem xet
 */
@Injectable({
    providedIn: 'root'
})
export class LoanProfilesStoreService extends BaseService {
    private _loanDetails: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'lender', 'fsLoanProfilesStore');
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    toggle(): void {
        this.drawer.toggle();
    }

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
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
     * getDetail
     *
     * @param payload
     */
    getDetail(id: string): Observable<BaseResponse> {
        return super.doGetDetail({ fsLoanProfilesId: +id }).pipe(
            tap((res) => {
                this._loanDetails.next(res.payload);
            })
        ) as Observable<BaseResponse>;
    }
    /**
     * getDetailCardDownDTO
     *
     * @param payload
     */
    getDetailCardDownDTO(payload: FsCardDownDTO = new FsCardDownDTO()):
        Observable<BaseResponse> {
        return this.doPost('getDetailCardDownDTO' ,payload);
    }
}
