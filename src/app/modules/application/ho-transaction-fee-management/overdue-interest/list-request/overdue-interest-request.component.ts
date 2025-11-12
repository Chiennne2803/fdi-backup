import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable, of} from 'rxjs';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {DialogService} from 'app/service/common-service/dialog.service';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {MatDrawer} from '@angular/material/sidenav';
import {PageEvent} from '@angular/material/paginator';
import {OverdueInterestService} from 'app/service';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {
    TASK_BAR_CONFIG,
    TABLE_BUTTON_ACTION_CONFIG_REQUEST,
    TABLE_OVERDUE_INTEREST_REQUEST
} from "../overdue-interest.config";
import {FsTranferWalletReqDTO} from "../../../../../models/service/FsTranferWalletReqDTO.model";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {CommonButtonConfig} from "../../../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'fee-loan-arrangement',
    templateUrl: './overdue-interest-request.component.html',
    encapsulation: ViewEncapsulation.None
})
export class OverdueInterestRequestComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_OVERDUE_INTEREST_REQUEST;
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
        private _overdueInterestService: OverdueInterestService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._overdueInterestService.lazyLoad;
        this._overdueInterestService.setDrawer(this.matDrawer);
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
                            this._overdueInterestService.delete({ids: requestLock}).subscribe((res) => {
                                if (res.errorCode === '0') {
                                    this._alertService.showMessageSuccess('Xoá yêu cầu thành công');
                                    this._overdueInterestService.searchOverdueInterestReq(this.searchPayload).subscribe();
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
                            {label: 'Tẩt cả', value: ''},
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
                    this._overdueInterestService.searchOverdueInterestReq(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._overdueInterestService.searchOverdueInterestReq({
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
        this._overdueInterestService
            .getDetail({fsTranferWalletReqId: row.fsTranferWalletReqId})
            .subscribe((res) => {
                this._overdueInterestService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._overdueInterestService.searchOverdueInterestReq().subscribe();
        }
        this._overdueInterestService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._overdueInterestService.searchOverdueInterestReq(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._overdueInterestService.searchOverdueInterestReq(this.searchPayload).subscribe();
    }

    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => (item.status !== 1)).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if (onlyDraft) {
            lstCommonBtn.push({type: 'deleted', role: 'SFF_REQUEST_FUNDING_DELETE', label : 'Xóa'});
        }

        this._tableBtnConfig = {
            commonBtn: [ {type: 'export', role: 'SFF_REQUEST_FUNDING_EXPORT', fileName : 'Lai_qua_han'},
                ...lstCommonBtn,
            ]
        };
    }
}
