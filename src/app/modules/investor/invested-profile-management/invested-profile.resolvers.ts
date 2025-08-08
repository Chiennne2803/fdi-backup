import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { InvestorListService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvestedProfileWaitingResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _investorListService: InvestorListService) {
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
        return this._investorListService.waitingApproval();
    }
}

@Injectable({
    providedIn: 'root'
})
export class InvestedProfileInvestingResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _investorListService: InvestorListService) {
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
        return this._investorListService.investing();
    }
}

@Injectable({
    providedIn: 'root'
})
export class InvestedProfileInvestedResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _investorListService: InvestorListService) {
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
        return this._investorListService.invested();
    }
}

@Injectable({
    providedIn: 'root'
})
export class InvestedProfileRejectedResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _investorListService: InvestorListService) {
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
        return this._investorListService.reject();
    }
}
