import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import {FsReqTransP2PService} from 'app/service/admin/req-trans-p2p.service';

@Injectable({
    providedIn: 'root'
})
export class OfferingResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _fsReqTransP2PService: FsReqTransP2PService) {
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
        return this._fsReqTransP2PService.getListBuy();
    }
}

@Injectable({
    providedIn: 'root'
})
export class FinishedResolvers implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _fsReqTransP2PService: FsReqTransP2PService) {
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
        return this._fsReqTransP2PService.getListBuyComplete();
    }
}
