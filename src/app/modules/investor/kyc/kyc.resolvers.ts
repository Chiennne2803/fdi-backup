import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {KycServices} from '../../../service/kyc/kyc.service';
import {KycPrepareLoadingPage} from '../../../shared/components/kyc/kyc-details/kyc.types';

@Injectable({
    providedIn: 'root'
})
export class InvestorKycResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _investorKycServices: KycServices)
    {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<KycPrepareLoadingPage>
    {
        return this._investorKycServices.loadingPrepareKycPage();
    }
}
