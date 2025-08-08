import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTransWithdrawCashDTO} from 'app/models/service';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * xu ly giao dich hoan tra nha dau tu
 */
@Injectable({
    providedIn: 'root'
})
export class WithdrawCashManagerService extends BaseService {
    private detailDrawer: MatDrawer;
    private _waiting: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _processed: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private selectedWithdraw: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'withdrawCashManager');
    }

    get waiting$(): Observable<BaseResponse> {
        return this._waiting.asObservable();
    }

    get processed$(): Observable<BaseResponse> {
        return this._processed.asObservable();
    }

    get selectedWithdraw$(): Observable<BaseResponse> {
        return this.selectedWithdraw.asObservable();
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

    setDataDetail(row): void {
        this.selectedWithdraw.next(row);
    }

    /**
     * Get products
     */
    getPrepareLoadingPage(): Observable<any> {
        return this.prepareLoadingPage();
    }

    /**
     * doSearchWaitProcessTransaction
     *
     * @param payload
     */
    doSearchWaitProcessTransaction(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitProcessTransaction', payload)
            .pipe(tap((res) => {
                this._waiting.next(res);
            }));
    }

    /**
     * doSearchProcessedTransaction
     *
     * @param payload
     */
    doSearchProcessedTransaction(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('processedTransaction', payload)
            .pipe(tap((res) => {
                this._processed.next(res);
            }));
    }

    /**
     * doSearchProgressingTransaction
     *
     * @param payload
     */
    progressingTransaction(payload: FsTransWithdrawCashDTO = new FsTransWithdrawCashDTO()):
        Observable<BaseResponse> {
        return this.doPost('progressingTransaction', payload);
    }

}
