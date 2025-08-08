import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {MatDrawer} from "@angular/material/sidenav";
import {FsLoanProfilesDTO} from "../../models/service";
import {BehaviorSubject, Observable, tap} from 'rxjs';

/**
 * ho so dang xem xet
 */
@Injectable({
    providedIn: 'root'
})
export class LoanProfilesReviewService extends BaseService {
    private _loanDetails: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;
    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'lender', 'fsLoanProfilesReview');
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    toggle(): void {
        this.drawer.toggle();
    }

    get loanDetails$(): Observable<BaseResponse> {
        return this._loanDetails.asObservable();
    }

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
    }

    /**
     * Get loan reviews
     *
     *
     * @param payload
     */
    doSearch(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * Get loan reviews
     *
     *
     * @param id
     */
    getDetail(id: string): Observable<BaseResponse> {
        return super.doGetDetail({ fsLoanProfilesId: +id }).pipe(
            tap((res) => {
                this._loanDetails.next(res.payload);
            })
        ) as Observable<BaseResponse>;
    }
}
