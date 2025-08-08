import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import {LoanProfilesReviewService, LoanProfilesService, LoanProfilesStoreService,} from 'app/service';
import { DashboardService } from 'app/service/common-service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoanReviewResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _loanReviewService: LoanProfilesReviewService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._loanReviewService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class LoanCallingResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _loanProfilesService: LoanProfilesService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._loanProfilesService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class LoanArchiveResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _loanProfilesStoreService: LoanProfilesStoreService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._loanProfilesStoreService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class DashBoardResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _dashboardService: DashboardService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._dashboardService.getDashBoard();
    }
}
