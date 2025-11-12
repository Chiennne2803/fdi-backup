import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import {
    TASK_BAR_CONFIG_WAIT,
    TABLE_INVESTOR_INVESTING_CONFIG_WAIT,
    TABLE_BUTTON_ACTION_WAIT_CONFIG
} from '../investor-charge-transaction.config';
import { MatDrawer } from '@angular/material/sidenav';
import { ButtonTableEvent } from 'app/shared/models/datatable/table-config.model';
import { GroupSearchComponent } from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeSearch,
    DropListSearch,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { FsTopupDTO } from "../../../../models/service";
import { TopUpTransactionService } from 'app/service/admin/topup-transaction.service';

@Component({
    selector: 'wait-charge-transaction',
    templateUrl: './wait-charge-transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WaitChargeTransactionComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG_WAIT;
    public _tableConfig = { ...TABLE_INVESTOR_INVESTING_CONFIG_WAIT, title: 'Danh sách giao dịch chờ nạp tiền', isViewDetail: false };
    public _tableBtnConfig = TABLE_BUTTON_ACTION_WAIT_CONFIG;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    /**
     * Constructor
     */
    constructor(
        private _topUpTransactionService: TopUpTransactionService,
        private _dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._topUpTransactionService.lazyLoad;
        this._topUpTransactionService.setDrawer(this.detailDrawer);
        this._dataSource$.subscribe((value) => {
            if (
                value.content?.length > 0 &&
                this._tableConfig?.footerTable &&
                this._tableConfig.footerTable.length > 0
            ) {
                const sumAmount = value.content.reduce((acc, x: FsTopupDTO) => acc + x.amount, 0);
                this._tableConfig.footerTable[0].value = sumAmount;
            }
        });
    }

    public handleSearch($event: Event): void {
        this._topUpTransactionService.doSearchWaitTransaction({
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        }).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this._topUpTransactionService.doSearchWaitTransaction({
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    public handleRowClick(row: any): void {
        this._topUpTransactionService
            .getDetail({ fsTopupId: row.fsTopupId })
            .subscribe(() => {
                this._topUpTransactionService.openDetailDrawer();
            });
    }

    public handleCloseDetailPanel($event: Event): void {
        this._tableConfig.isViewDetail = false;
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
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
                        new InputSearch('transCode', 'Mã giao dịch', null, false),
                        new InputSearch('fullNameReceiver', 'Người thụ hưởng', null, false),
                        // new InputSearch('fullNameSent', 'Tên người chuyển', null, false),
                        new InputSearch('amount', 'Số tiền nạp (VND)', null, false, 'number'),
                        new DateTimeSearch('transDate', 'Thời gian giao dịch', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            { label: 'Tẩt cả', value: '' },
                            { label: 'Thành công', value: 0 },
                            { label: 'Giao dịch không xác định được người thụ hưởng', value: 2 },
                            { label: 'Số tiền giao dịch không hợp lệ', value: 3 },
                            // {label: 'Nạp tiền vào ví HO thất bại', value: 4},
                            { label: 'Nạp tiền vào ví nhà đầu tư thất bại', value: 5 },
                            { label: 'Giao dịch không xác định được người thụ hưởng và số tiền giao dịch không hợp lệ', value: 6 },
                        ], null),
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
                    this._topUpTransactionService.doSearchWaitTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._topUpTransactionService.doSearchWaitTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
