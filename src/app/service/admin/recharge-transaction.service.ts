import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTopupMailTransferDTO} from 'app/models/service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from "../../../@fuse/components/alert";


/**
 * xu ly giao dich nap tien
 */
@Injectable({
    providedIn: 'root'
})
export class RechargeTransactionService extends BaseService {
    private detailDrawer: MatDrawer;
    private _selected: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'rechargeTransaction');
    }

    get selected$(): Observable<BaseResponse> {
        return this._selected.asObservable();
    }

    setDrawer(drawer: MatDrawer): void {
        this.detailDrawer = drawer;
    }

    toggleDetailDrawer(): void {
        this.detailDrawer.toggle();
    }

    openDetailDrawer(): void {
        this.detailDrawer.open();
    }

    closeDetailDrawer(): void {
        this.detailDrawer.close();
    }

    /**
     * doSearchErrorTransaction
     *
     * @param payload
     */
    doSearchErrorTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('errorTransaction', payload);
    }

    /**
     * doSearchSuccessTransaction
     *
     * @param payload
     */
    doSearchSuccessTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('successTransaction', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload):
        Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                this._selected.next(res);
            })
        );
    }

    /**
     * getDetail
     *
     * @param payload
     */
    update(payload: FsTopupMailTransferDTO = new FsTopupMailTransferDTO()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
