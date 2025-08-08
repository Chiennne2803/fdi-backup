import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTranspayReqDTO} from 'app/models/service';
import {TranspayReqTransactionService} from 'app/service';
import {Observable} from 'rxjs';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {MatDrawer} from '@angular/material/sidenav';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {DropListSearch, InputSearch} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {
    TABLE_BUTTON_WAIT_APPROVE_CONFIG,
    TABLE_WAIT_APPROVE_CONFIG,
    TASK_BAR_CONFIG
} from "./wait-approve-trans.config";


@Component({
    selector: 'app-wait-approve-trans',
    templateUrl: './wait-approve-trans.component.html'
})
export class WaitApproveTransComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    dataSource$: Observable<BaseResponse>;
    detail$: Observable<FsTranspayReqDTO>;

    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_WAIT_APPROVE_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_WAIT_APPROVE_CONFIG;

    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };
    private _dataSearchDialog: object;

    constructor(
        private _transPayReqService: TranspayReqTransactionService,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.dataSource$ = this._transPayReqService.lazyLoad;
        this.detail$ = this._transPayReqService.transPayReqDetail$;
        this._transPayReqService.showDetail(false);
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this._dataSearchDialog,
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this.reSubscribeData();
    }

    handleRowClick(value: FsTranspayReqDTO): void {
        this._transPayReqService.getDetail(
            { fsTranspayReqId: value.fsTranspayReqId }
        ).subscribe((res) => {
            this.matDrawer.open();
            this._transPayReqService.showDetail(true);
        });
    }

    onClickAdd(event: ButtonTableEvent): void {
        this._transPayReqService.showDetail(true);
        const dialogRef = this._dialogService.openMakeRequestLenderRefundDialog();
        dialogRef.afterClosed().subscribe((res) => {
            if ( res && res.success ) {
                this.reSubscribeData();
            }
        });
    }

    handleCloseDetailPanel(): void {
        this.matDrawer.close();
        this.reSubscribeData();
        this._tableConfig.isViewDetail = false;
        this._transPayReqService.showDetail(false);
    }

    reSubscribeData(): void {
        this._transPayReqService.doSearchWaitApproveTransaction(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._transPayReqService.doSearchWaitApproveTransaction(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.onClickAdd(event);
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
                        new InputSearch('transCode', 'Mã giao dịch', null, false),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ huy động vốn', null, false),
                        new InputSearch('admAccountId', 'Bên huy động vốn', null, false),
                        new InputSearch('amount', 'Tổng tiền thanh toán (VNĐ) ', null, false, 'number'),
                        new InputSearch('fullNameSent', 'Tên người chuyển', null, false),
                        new InputSearch('accNoSent', 'Tài khoản chuyển', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Bị từ chối', value: 4},
                            {label: 'Đã phê duyệt', value: 3},
                        ], null),
                        new InputSearch('paidAmount', 'Số tiền chuyển', null, false),
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
                    this._transPayReqService.doSearchWaitApproveTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._transPayReqService.doSearchWaitApproveTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
