import {Component, OnInit, ViewChild} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTranspayInvestorDTO} from 'app/models/service';
import {AdmAccessLogService, TranspayInvestorTransactionService} from 'app/service';
import { Observable } from 'rxjs';
import {MatDrawer} from '@angular/material/sidenav';
import {
    TABLE_BUTTON_CONFIG, TABLE_INVESTOR_TRANSPAY_REQ_PROCESS_CONFIG, TASK_BAR_TRANSPAY_REQ_PROCESS_CONFIG,
} from './/lender.config';
import {DialogService} from 'app/service/common-service/dialog.service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {DateTimeSearch, DropListSearch, InputSearch} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
    selector: 'app-processed-trans',
    templateUrl: './lender.component.html',
    styleUrls: ['./lender.component.scss'],
    animations: fuseAnimations
})
export class LenderComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    dataSource$: Observable<BaseResponse>;
    dataDetail$: Observable<FsTranspayInvestorDTO>;
    tableTransConfig = TABLE_INVESTOR_TRANSPAY_REQ_PROCESS_CONFIG;
    taskBarConfig = TASK_BAR_TRANSPAY_REQ_PROCESS_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_CONFIG;
    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };
    private _dataSearchDialog: object;

    constructor(
        private _admAccessLogService: AdmAccessLogService,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.dataSource$ = this._admAccessLogService.lazyLoad;
        this._admAccessLogService.setDrawer(this.matDrawer);
    }

    handlePageSwitch($event: PageEvent): void {
        this._admAccessLogService.doSearchAccessLogLender({
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    handleRowClick(row: any): void {
        this._admAccessLogService
            .getDetail({ admAccessLogId: row.admAccessLogId })
            .subscribe(() => {
                this._admAccessLogService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel(): void {
        this.matDrawer.close();
        this.tableTransConfig.isViewDetail = false;
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._admAccessLogService.doSearchAccessLogLender(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountName', 'Tên tài khoản', null, false),
                        new InputSearch('ip', 'IP', null, false),
                        new InputSearch('device', 'Thiết bị', null, false),
                        new InputSearch('os', 'Hệ điều hành', null, false),
                        new InputSearch('browser', 'Trình duyệt sử dụng', null, false),
                        new DateTimeSearch( 'loginTime', 'Đăng nhập lần cuối', null, false),
                    ]
                },
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.btnSearchClicked.subscribe(
            (response) => {
                if (response.action === 'reset') {
                    this._admAccessLogService.doSearchAccessLogLender({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._admAccessLogService.doSearchAccessLogLender(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
