import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { ManagementStaffService } from 'app/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StaffResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _staffService: ManagementStaffService) {
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
        return this._staffService.doSearch();
    }
}
