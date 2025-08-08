import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { CategoriesService } from 'app/service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryResolvers implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _categoriesService: CategoriesService) {
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
        return this._categoriesService.parentAll();
    }
}
