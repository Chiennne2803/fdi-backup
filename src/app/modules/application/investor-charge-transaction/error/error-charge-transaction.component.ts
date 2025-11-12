import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { RechargeTransactionService } from 'app/service';
import { Observable } from 'rxjs';
import {
    TABLE_BUTTON_ACTION_ERROR_CONFIG,
    TABLE_INVESTOR_INVESTING_CONFIG_ERROR,
    TASK_BAR_CONFIG_ERROR
} from '../investor-charge-transaction.config';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeSearch,
    DropListSearch,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {FsTopupMailTransferDTO} from "../../../../models/service";


@Component({
    selector: 'error-charge-transaction',
    templateUrl: './error-charge-transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ErrorChargeTransactionComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG_ERROR;
    public _tableConfig = { ...TABLE_INVESTOR_INVESTING_CONFIG_ERROR, title: 'Danh sách giao dịch lỗi', isViewDetail: false };
    public _tableBtnConfig = TABLE_BUTTON_ACTION_ERROR_CONFIG;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
        private _dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._rechargeTransactionService.lazyLoad;
        this._dataSource$.subscribe((value) => {
            if (value.content?.length > 0) {
                let sumAmount = 0;
                value.content.forEach((x: FsTopupMailTransferDTO) => {
                    sumAmount = sumAmount + x.amount;
                })
                this._tableConfig.footerTable[0].value = sumAmount;
            }
        });
        this._rechargeTransactionService.setDrawer(this.detailDrawer);
    }

    public handleSearch($event: Event): void {
        this._rechargeTransactionService.doSearchErrorTransaction({
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        }).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this._rechargeTransactionService.doSearchErrorTransaction({
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    public handleRowClick(row: any): void {
        this._rechargeTransactionService
            .getDetail({ fsTopupMailTransferId: row.fsTopupMailTransferId })
            .subscribe(() => {
                this._rechargeTransactionService.openDetailDrawer();
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
                        new DateTimeSearch( 'transDate', 'Thời gian giao dịch', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Thành công', value: 0},
                            {label: 'Giao dịch không xác định được người thụ hưởng', value: 2},
                            {label: 'Số tiền giao dịch không hợp lệ', value: 3},
                            // {label: 'Nạp tiền vào ví HO thất bại', value: 4},
                            {label: 'Nạp tiền vào ví nhà đầu tư thất bại', value: 5},
                            {label: 'Giao dịch không xác định được người thụ hưởng và số tiền giao dịch không hợp lệ', value: 6},
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
                    this._rechargeTransactionService.doSearchErrorTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._rechargeTransactionService.doSearchErrorTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
