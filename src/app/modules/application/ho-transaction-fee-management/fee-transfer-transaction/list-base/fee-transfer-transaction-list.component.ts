import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ButtonTableEvent} from '../../../../../shared/models/datatable/table-config.model';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {TransferTransactionFeeService} from '../../../../../service';
import {MatDrawer} from '@angular/material/sidenav';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FeeTransferTransactionDialogComponent} from "./create-dialog/fee-transfer-transaction-dialog.component";
import {PageEvent} from "@angular/material/paginator";
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {
    TASK_BAR_CONFIG,
    TABLE_BUTTON_ACTION_CONFIG_LIST,
    TABLE_FEE_TRANSFER_TRANSACTION_LIST
} from "../fee-transfer-transaction.config";


@Component({
    selector: 'fee-loan-arrangement',
    templateUrl: './fee-transfer-transaction-list.component.html',
    styleUrls: ['./fee-transfer-transaction-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeeTransferTransactionListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_FEE_TRANSFER_TRANSACTION_LIST;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_LIST;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _transferTransactionFeeService: TransferTransactionFeeService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._transferTransactionFeeService.lazyLoad;
        this._transferTransactionFeeService.setDrawer(this.matDrawer);
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'add':
                const dialogConfig = new MatDialogConfig();

                dialogConfig.autoFocus = true;
                dialogConfig.data = event.data;
                dialogConfig.disableClose = true;
                dialogConfig.width = '60%';

                setTimeout(() => {
                    const dialog = this._matDialog.open(FeeTransferTransactionDialogComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                        }
                    });
                }, 0);
                break;
            default:
                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountIdPresenterName', 'Khách hàng', null, false),
                        new DateTimeFromToSearch('transDate', 'Ngày ghi nhận', null, false),
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
                    this._transferTransactionFeeService.searchTransferTransactionFee(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._transferTransactionFeeService.searchTransferTransactionFee({
                        ...response.form.value,
                        ...this.searchPayload,
                        // createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : undefined,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._transferTransactionFeeService.searchTransferTransactionFee(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._transferTransactionFeeService.searchTransferTransactionFee(this.searchPayload).subscribe();
    }
}
