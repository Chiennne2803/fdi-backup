import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import { ConfigInvestorService } from './../../../service/admin/config-investor.service';
@Injectable({
    providedIn: 'root'
})
export class AutomaticInvestmentResolvers implements Resolve<BaseResponse> {
    /**
     * Constructor
     */
     constructor(private _configInvestorService: ConfigInvestorService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._configInvestorService.doSearch();
    }
}