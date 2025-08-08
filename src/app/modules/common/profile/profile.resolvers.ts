import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';

import { Observable } from 'rxjs';
import {ProfileService} from '../../../service/common-service';


@Injectable({
    providedIn: 'root'
})
export class ProfileResolvers implements Resolve<BaseResponse>
{
    /**
     * Constructor
     */
    constructor(private _profileService: ProfileService) {
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
        return this._profileService.getPrepareLoadingPage();
    }
}
