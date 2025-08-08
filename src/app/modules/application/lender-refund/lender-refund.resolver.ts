import {Injectable} from '@angular/core';
import {TranspayReqTransactionService} from '../../../service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PrepareLoadingPageTrans} from '../../../models/service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LenderRefundResolver implements Resolve<PrepareLoadingPageTrans> {
    constructor(
        private _transpayReqTransService: TranspayReqTransactionService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PrepareLoadingPageTrans> {
        return this._transpayReqTransService.prepare();
    }
}
