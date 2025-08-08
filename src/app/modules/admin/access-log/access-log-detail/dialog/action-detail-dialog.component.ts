import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AdmActionDetailService} from "../../../../../service/admin/adm-action-detail-service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Observable, Subscription} from "rxjs";
import {BaseRequest, BaseResponse} from "../../../../../models/base";
import {TABLE_ACTION_DETAIL_CONFIG} from "./action-detail-config";

@Component({
    selector: 'action-detail-dialog',
    templateUrl: './action-detail-dialog.component.html'
})
export class ActionDetailDialogComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource$: Observable<BaseResponse>;
    tableTransConfig = TABLE_ACTION_DETAIL_CONFIG;
    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };
    private subscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<ActionDetailDialogComponent>,
        private _actionDetailService: AdmActionDetailService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit(): void {
        this.dataSource$ = this._actionDetailService.lazyLoad;
        this.subscription = this._actionDetailService.doGetActionDetail({
            ...this.searchPayload,
            ...this.data
        }).subscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this._actionDetailService.setLazyLoad(null);
    }

    handlePageSwitch($event: PageEvent): void {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this._actionDetailService.doGetActionDetail({
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }
}
