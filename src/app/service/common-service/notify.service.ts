import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import {HttpService} from 'app/shared/services/common/http.service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class NotifyService extends HttpService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private urlPath = "notify";

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient);
    }

    public prepare(): Observable<BaseResponse> {
        return this.get(this.urlPath).pipe(
            tap((res: BaseResponse) => {
                this._prepare.next(res);
            })
        );
    }
}
