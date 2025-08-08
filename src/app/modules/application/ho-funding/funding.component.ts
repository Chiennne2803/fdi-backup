import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementCashInService} from 'app/service/admin/management-cash-in.service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {RequestFundingDialogComponent} from './components/request-funding-dialog/request-funding-dialog.component';
import {TABLE_BUTTON_ACTION_CONFIG_FUNDING, TABLE_FUNDING_CONFIG, TASK_BAR_CONFIG_FUNDING} from './funding.config';
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {ButtonConfig, CommonButtonConfig} from "../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'app-funding',
    templateUrl: './funding.component.html',
    styleUrls: ['./funding.component.scss']
})
export class FundingComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_FUNDING_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_FUNDING;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_FUNDING;
    public detailId: number = 0;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    public wHo: number = 0;
    public totalCashIn: number = 0;

    /**
     * constructor
     * @param _matDialog
     * @param _manageCashInService
     */
    constructor(
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _manageCashInService: ManagementCashInService
    ) {
    }

    ngOnInit(): void {
        this._manageCashInService.prepare$.subscribe((res) => {
            if (res.payload) {
                if (res.payload.wHo != undefined) {
                    this.wHo = res.payload.wHo;
                }
                if (res.payload.totalChargeCash != undefined) {
                    this.totalCashIn = res.payload.totalChargeCash;
                }
            }
        });
        this._manageCashInService.setDrawer(this.matDrawer);
        this._dataSource = this._manageCashInService.lazyLoad;
    }

    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.data = null;
                dialogConfig.disableClose = true;
                dialogConfig.width = '60%';
                setTimeout(() => {
                    const dialog = this._matDialog.open(RequestFundingDialogComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                            this._manageCashInService.doSearch().subscribe();
                        }
                    });
                }, 0);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'deleted':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận xoá yêu cầu?',
                    message: '',
                    actions: {
                        confirm: {
                            label: 'Đồng ý'
                        },
                        cancel: {
                            label: 'Hủy',
                        }
                    }
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        const requestLock = (event.data as FsChargeCashReqDTO[]).map(x => x.fsChargeCashReqId);
                        this._manageCashInService.lockAll({ids: requestLock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._manageCashInService.doSearch(this.searchPayload).subscribe();
                                this._manageCashInService.prepare().subscribe();
                                this._fuseAlertService.showMessageSuccess('Xoá yêu cầu thành công');
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

    public handleRowClick(event: FsChargeCashReqDTO): void {
        this.detailId = event.fsChargeCashReqId;
        this._manageCashInService.openDetailDrawer();
    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            this._manageCashInService.doSearch().subscribe();
        }
        this._manageCashInService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._manageCashInService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._manageCashInService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
                        new DropListSearch('transType', 'Loại yêu cầu', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Tiếp quỹ tiền điện tử', value: 3},
                            {label: 'Tiếp quỹ tiền mặt', value: 2},
                        ], null),
                        new DateTimeFromToSearch('createdDate', 'Ngày lập', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Xóa', value: 0},
                            {label: 'Soạn thảo', value: 1},
                            {label: 'Chờ xử lý', value: 2},
                            {label: 'Phê duyệt', value: 3},
                            {label: 'Từ chối', value: 4},
                            {label: 'Chờ hạch toán', value: 5},
                            {label: 'Thành công', value: 6},
                        ], ''),
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
                    this._manageCashInService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._manageCashInService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => item.status !== 1).length == 0;
        let lstOtherBtn: ButtonConfig[] = [];
       if (onlyDraft) {
           lstOtherBtn.push(new ButtonConfig('SFF_CASH_CURRENCY_FUNDING_DELETE', true, false, 'Xoá', 'heroicons_outline:trash', 'deleted'));
        }
        this._btnConfig = {
            commonBtn: [
                {type: 'export', role: 'SFF_CASH_CURRENCY_FUNDING_EXPORT', fileName : 'Tiep_quy_tien_mat_tien_dien_tu'},
            ],
            otherBtn: [
                ...lstOtherBtn,
            ]
        };
    }
}
