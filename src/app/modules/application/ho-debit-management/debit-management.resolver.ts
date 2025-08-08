import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilesManagementService } from '../../../service/admin/profiles-management.service';
import {BaseResponse} from '../../../models/base/base-response';

@Injectable({
    providedIn: 'root'
})
export class DebitManagementResolver implements Resolve<any> {
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
