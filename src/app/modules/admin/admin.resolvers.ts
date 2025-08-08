import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementDebtService } from 'app/service';
import { Observable } from 'rxjs';
import {DashboardService} from "../../service/common-service";

@Injectable({
    providedIn: 'root'
})
export class DebtManagementResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _managementDebtService: ManagementDebtService) {
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
        return this._managementDebtService.doSearch();
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
