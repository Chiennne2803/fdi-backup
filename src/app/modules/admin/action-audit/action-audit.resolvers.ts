import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { AdmAccessLogService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccessLogStaffResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accessLogService: AdmAccessLogService) {
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
        return this._accessLogService.doSearchAccessLogStaff();
    }
}

@Injectable({
    providedIn: 'root'
})
export class AccessLogInvestorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accessLogService: AdmAccessLogService) {
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
        return this._accessLogService.doSearchAccessLogInvestor();
    }
}
@Injectable({
    providedIn: 'root'
})
export class AccessLogLenderResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accessLogService: AdmAccessLogService) {
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
        return this._accessLogService.doSearchAccessLogLender();
    }
}
