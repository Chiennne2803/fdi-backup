import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ProfilesManagementService } from 'app/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfilesReceptionResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileReception();
    }
}
@Injectable({
    providedIn: 'root'
})
export class ProfilesReviewingResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileReview();
    }
}
@Injectable({
    providedIn: 'root'
})
export class ProfilesReReviewingResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileReReview();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProfilesApproveResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileApprove();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProfilesRejectResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileReject();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProfilesDisbursementResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileDisbursement();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProfilesWaitPaymentResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileWaitingDisbursement();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProfilesArchiveResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _profilesManagementService: ProfilesManagementService) {
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
        return this._profilesManagementService.doSearchLoanProfileClose();
    }
}
