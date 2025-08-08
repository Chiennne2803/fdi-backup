import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { EmailConfigService } from 'app/service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class EmailConfigResolver implements Resolve<any> {

    constructor(
        private _emailService: EmailConfigService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._emailService.prepareEmailConfig();
    }
}
