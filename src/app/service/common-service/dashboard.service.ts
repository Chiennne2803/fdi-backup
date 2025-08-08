import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {BaseResponse} from '../../models/base';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {DashboardDTO} from "../../models/admin/DashboardDTO.model";

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends BaseService {
    private _dashBoard: BehaviorSubject<DashboardDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'dashboard');
    }

    get dashboard$(): Observable<DashboardDTO> {
        return this._dashBoard.asObservable();
    }

    /**
     * Get data borrower dashboard
     *
     *
     */
    getDashBoard(): Observable<BaseResponse> {
        return this.get(this.url).pipe(
            tap((res) => {
                this._dashBoard.next(res.payload);
            })
        );
    }

}
