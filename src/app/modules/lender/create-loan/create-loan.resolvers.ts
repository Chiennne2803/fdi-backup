import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { LoanProfilesService } from 'app/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CreateLoanResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _loanService: LoanProfilesService) {
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
        return this._loanService.getPrepareLoadingPage();
    }
}
