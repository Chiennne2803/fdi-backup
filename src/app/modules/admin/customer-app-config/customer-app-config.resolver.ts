import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {CustomerAppConfigService} from "../../../service/admin/customer-app-config.service";

@Injectable({
    providedIn: 'root'
})
export class CustomerAppConfigResolver implements Resolve<BaseResponse> {
    constructor(private _appConfigService: CustomerAppConfigService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._appConfigService.prepare();
    }
}
