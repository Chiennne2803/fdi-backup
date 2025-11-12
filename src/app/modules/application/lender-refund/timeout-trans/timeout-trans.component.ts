import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTranspayReqDTO} from 'app/models/service';
import {TranspayReqTransactionService} from 'app/service';
import {Observable} from 'rxjs';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {MatDialog} from '@angular/material/dialog';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {DropListSearch, InputSearch} from '../../../../shared/components/group-search/search-config.models';
import {TABLE_BUTTON_TIMEOUT_TRANS_CONFIG, TABLE_TIMEOUT_TRANS_CONFIG, TASK_BAR_CONFIG} from "./timeout-trans.config";
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {CommonButtonConfig} from "../../../../shared/models/datatable/task-bar.model";


@Component({
    selector: 'app-timeout-trans',
    templateUrl: './timeout-trans.component.html'
})
export class TimeoutTransComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public dataSource$: Observable<BaseResponse>;
    public detail$: Observable<FsTranspayReqDTO>;

    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_TIMEOUT_TRANS_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_TIMEOUT_TRANS_CONFIG;

    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };
    private _dataSearchDialog: object;

    constructor(
        private _transPayReqService: TranspayReqTransactionService,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
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
            this._transPayReqService.showDetail(true);
            this.matDrawer.open();
        });
    }

    handleCloseDetailPanel(): void {
        this.matDrawer.close();
        this.reSubscribeData();
        this._tableConfig.isViewDetail = false;
        this._transPayReqService.showDetail(false);
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

    reSubscribeData(): void {
        this._transPayReqService.doSearchTimeoutTransaction(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._transPayReqService.doSearchTimeoutTransaction(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.onClickAdd(event);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'deleted':
                const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận hủy yêu cầu thanh toán');
                confirmDialog.afterClosed().subscribe((res) => {
                    if ( res === 'confirmed' ) {
                        const requestExit = (event.rowItem as FsTranspayReqDTO[]).map(x => x.fsTranspayReqId);
                        this._transPayReqService.cancelRequest({
                            ids: requestExit
                        }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Hủy thành công');
                                this.reSubscribeData();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });
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
                        new InputSearch('amount', 'Tổng tiền thanh toán (VND) ', null, false, 'number'),
                        new InputSearch('fullNameSent', 'Tên người chuyển', null, false),
                        new InputSearch('accNoSent', 'Tài khoản chuyển', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
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
                    this._transPayReqService.doSearchTimeoutTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._transPayReqService.doSearchTimeoutTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
    checkboxItemChange(rows): void {
        const timeOut = rows.filter(item => (item.status === 6)).length > 0;
        const cancelRequest = rows.filter(item => item.status === 8).length > 0;

        let lstCommonBtn: CommonButtonConfig[] = [];

        if(timeOut && !cancelRequest) {
            lstCommonBtn.push({label: 'Hủy yêu cầu',type : 'deleted', role : 'SFF_REFUND_TRANSACTION_UPDATE', icon: 'feather:x-square'});
        }
        this._tableBtnConfig = {
            commonBtn: [
                ...lstCommonBtn,
                {type : 'export', role : 'SFF_REFUND_TRANSACTION_EXPORT', fileName : 'Xu_ly_giao_dich_hoan_tra_khoan_huy_dong'}

            ],
            otherBtn: [
            ]
        };
    }

}
