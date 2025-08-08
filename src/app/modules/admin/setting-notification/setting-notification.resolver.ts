import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BaseResponse } from 'app/models/base';

import { NotificationConfigService } from './../../../service/admin/notification-config.service';

@Injectable({
    providedIn: 'root'
})
export class SettingNotificationResolver implements Resolve<BaseResponse> {
    constructor(
        private _service: NotificationConfigService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._service.prepare();
    }
}
