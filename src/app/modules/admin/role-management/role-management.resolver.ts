import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { DecentralizedService } from 'app/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleManagementResolver implements Resolve<BaseResponse> {
    constructor(
        private _service: DecentralizedService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.prepare();
    }
}
