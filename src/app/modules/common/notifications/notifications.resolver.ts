import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {NotificationsService} from "../../../service/common-service/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class NotificationsResolver implements Resolve<BaseResponse> {

    constructor(private _notificationsService: NotificationsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._notificationsService.doSearch({limit: 10});
    }
}
