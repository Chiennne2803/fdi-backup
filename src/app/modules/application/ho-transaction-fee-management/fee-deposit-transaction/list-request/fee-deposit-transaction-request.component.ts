import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {DialogService} from 'app/service/common-service/dialog.service';
import {MatDrawer} from '@angular/material/sidenav';
import {DepositTransactionFeeService} from "../../../../../service/admin/managementTransactionFee";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {
    TASK_BAR_CONFIG,
    TABLE_FEE_DEPOSIT_TRANSACTION_REQUEST,
    TABLE_BUTTON_ACTION_CONFIG_REQUEST
} from "../fee-deposit-transaction.config";
import {FsTranferWalletReqDTO} from "../../../../../models/service/FsTranferWalletReqDTO.model";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {CommonButtonConfig} from "../../../../../shared/models/datatable/task-bar.model";

@Component({
    selector     : 'fee-loan-arrangement',
    templateUrl  : './fee-deposit-transaction-request.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FeeDepositTransactionRequestComponent implements OnInit
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_FEE_DEPOSIT_TRANSACTION_REQUEST;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_REQUEST;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    /**
     * Constructor
     */
    constructor(
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _alertService: FuseAlertService,
        private _depositTransactionFeeService: DepositTransactionFeeService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._depositTransactionFeeService.lazyLoad;
        this._depositTransactionFeeService.setDrawer(this.matDrawer);
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'add':
                const dialogAdd = this._dialogService.openFeeTransactionCreate();
                dialogAdd.afterClosed().subscribe(_ => console.log('closed'));
                break;
            case 'deleted':
                let checkStatus = true;
                (event.rowItem as FsTranferWalletReqDTO[]).forEach(fsTranferWalletReqDTO => {
                    if (fsTranferWalletReqDTO.status != 1) {
                        checkStatus = false;
                        return;
                    }
                });
                if (checkStatus) {
                    const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận xóa yêu cầu');
                    confirmDialog.afterClosed().subscribe((res) => {
                        if ( res === 'confirmed' ) {
                            const requestLock = (event.rowItem as FsTranferWalletReqDTO[]).map(x => x.fsTranferWalletReqId);
                            this._depositTransactionFeeService.delete({ids: requestLock}).subscribe((res) => {
                                if (res.errorCode === '0') {
                                    this._alertService.showMessageSuccess('Xoá yêu cầu thành công');
                                    this._depositTransactionFeeService.searchDepositTransactionFeeReq(this.searchPayload).subscribe();
                                } else {
                                    this._alertService.showMessageError(res.message.toString());
                                }
                            });
                        }
                    });
                } else {
                    this._alertService.showMessageError("Trạng thái không hợp lệ");
                }
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
                        new InputSearch('fsLoanProfilesId', 'Mã yêu cầu', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Soạn thảo', value: 1},
                            {label: 'Chờ xử lý', value: 2},
                            {label: 'Phê duyệt', value: 3},
                            {label: 'Từ chối', value: 4},
                        ], null),
                        new DateTimeFromToSearch('createdDate', 'Ngày lập', null, false)
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
                    this._depositTransactionFeeService.searchDepositTransactionFeeReq(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._depositTransactionFeeService.searchDepositTransactionFeeReq({
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

    public handleRowClick(row: any): void {
        this._depositTransactionFeeService
            .getDetail({fsTranferWalletReqId: row.fsTranferWalletReqId})
            .subscribe((res) => {
                this._depositTransactionFeeService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._depositTransactionFeeService.searchDepositTransactionFeeReq().subscribe();
        }
        this._depositTransactionFeeService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._depositTransactionFeeService.searchDepositTransactionFeeReq(this.searchPayload).subscribe();
    }
    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._depositTransactionFeeService.searchDepositTransactionFeeReq(this.searchPayload).subscribe();
    }

    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => (item.status !== 1)).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if (onlyDraft) {
            lstCommonBtn.push({type: 'deleted', role: 'SFF_REQUEST_FUNDING_DELETE', label : 'Xóa'});
        }

        this._tableBtnConfig = {
            commonBtn: [ {type: 'export', role: 'SFF_REQUEST_FUNDING_EXPORT', fileName : 'Phi_nap_tien'},
                ...lstCommonBtn,
            ]
        };
    }
}
