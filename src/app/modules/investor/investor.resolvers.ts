import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';

import { Observable } from 'rxjs';
import { AccountStatementService, TopupService } from '../../service';
import {DashboardService} from "../../service/common-service";


@Injectable({
    providedIn: 'root'
})
export class InvestorResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accountStatementService: AccountStatementService) {
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
        return this._accountStatementService.doSearch();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TopUpResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _topUpService: TopupService) {
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
        return this._topUpService.doSearch();
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
