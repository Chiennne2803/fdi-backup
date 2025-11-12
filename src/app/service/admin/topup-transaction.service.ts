import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { FsTopupDTO, FsTopupMailTransferDTO } from 'app/models/service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BaseService } from '../base-service';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseAlertService } from '../../../@fuse/components/alert';

/**
 * Xử lý giao dịch nạp tiền
 */
@Injectable({
    providedIn: 'root'
})
export class TopUpTransactionService extends BaseService {
    private detailDrawer: MatDrawer;
    private _selected: BehaviorSubject<BaseResponse | FsTopupDTO | null> = new BehaviorSubject(null);

    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'topupManagement');
    }

    get selected$(): Observable<BaseResponse | FsTopupDTO | null> {
        return this._selected.asObservable();
    }

    setDrawer(drawer: MatDrawer): void {
        this.detailDrawer = drawer;
    }

    toggleDetailDrawer(): void {
        this.detailDrawer?.toggle();
    }

    openDetailDrawer(): void {
        this.detailDrawer?.open();
    }

    closeDetailDrawer(): void {
        this.detailDrawer?.close();
    }

    /**
     * Lấy danh sách giao dịch chờ nạp tiền
     */
    doSearchWaitTransaction(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitTransaction', payload);
    }

    /**
     * Lấy chi tiết giao dịch
     */
    getDetail(payload): Observable<BaseResponse> {
        return this.doGetDetail(payload).pipe(
            tap((res) => {
                console.log('[DisbursementTransactionService] API trả về:', res);
                this._selected.next(res);
            })
        );
    }

    /**
     * Cập nhật giao dịch
     */
    update(payload: FsTopupDTO = new FsTopupDTO()): Observable<BaseResponse> {
        const body = this.buildBodyParams(payload);
        return this.post(`${this.url}/handleWaitTransaction`, body);
    }
}
