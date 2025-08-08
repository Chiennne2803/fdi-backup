import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { AccountBankService } from 'app/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BankAccountResolver implements Resolve<BaseResponse> {

    constructor(private _bankAccountService: AccountBankService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._bankAccountService.prepare();
    }
}
