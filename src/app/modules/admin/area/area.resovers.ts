import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';

import { Observable } from 'rxjs';
import {AreaService} from "../../../service/admin/area.service";

@Injectable({
    providedIn: 'root'
})
export class AreaResolvers implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _areaService: AreaService) {
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
        return this._areaService.getAllProvince();
    }
}
