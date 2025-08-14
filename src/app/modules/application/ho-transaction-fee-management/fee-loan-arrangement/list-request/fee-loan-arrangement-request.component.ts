import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';

import {BaseRequest, BaseResponse} from 'app/models/base';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {DialogService} from 'app/service/common-service/dialog.service';
import {LoanArrangementFeeService} from 'app/service/admin/managementTransactionFee';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {MatDrawer} from '@angular/material/sidenav';
import {PageEvent} from "@angular/material/paginator";
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {MatDialog} from "@angular/material/dialog";
import {
    TASK_BAR_CONFIG,
    TABLE_BUTTON_ACTION_CONFIG_REQUEST,
    TABLE_FEE_LOAN_ARRANGEMENT_REQUEST
} from "../fee-loan-arrangement.config";
import {FsTranferWalletReqDTO} from "../../../../../models/service/FsTranferWalletReqDTO.model";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {CommonButtonConfig} from "../../../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'fee-loan-arrangement',
    templateUrl: './fee-loan-arrangement-request.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FeeLoanArrangementRequestComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_FEE_LOAN_ARRANGEMENT_REQUEST;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_REQUEST;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _alertService: FuseAlertService,
        private _loanArrangementFeeService: LoanArrangementFeeService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._loanArrangementFeeService.lazyLoad;
        this._loanArrangementFeeService.setDrawer(this.matDrawer);
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
                            this._loanArrangementFeeService.delete({ids: requestLock}).subscribe((res) => {
                                if (res.errorCode === '0') {
                                    this._alertService.showMessageSuccess('Xoá yêu cầu thành công');
                                    this._loanArrangementFeeService.searchLoanArrangementFeeReq(this.searchPayload).subscribe();
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
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
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
                    this._loanArrangementFeeService.searchLoanArrangementFeeReq(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._loanArrangementFeeService.searchLoanArrangementFeeReq({
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
        this._loanArrangementFeeService
            .getDetail({fsTranferWalletReqId: row.fsTranferWalletReqId})
            .subscribe((res) => {
                this._loanArrangementFeeService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._loanArrangementFeeService.searchLoanArrangementFeeReq().subscribe();
        }
        this._loanArrangementFeeService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._loanArrangementFeeService.searchLoanArrangementFeeReq(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._loanArrangementFeeService.searchLoanArrangementFeeReq(this.searchPayload).subscribe();
    }


    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => (item.status !== 1)).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if (onlyDraft) {
            lstCommonBtn.push({type: 'deleted', role: 'SFF_REQUEST_FUNDING_DELETE', label : 'Xóa'});
        }

        this._tableBtnConfig = {
            commonBtn: [ {type: 'export', role: 'SFF_REQUEST_FUNDING_EXPORT', fileName : 'Phi_thu_sep_khoan_vay'},
                ...lstCommonBtn,
            ]
        };
    }
}
