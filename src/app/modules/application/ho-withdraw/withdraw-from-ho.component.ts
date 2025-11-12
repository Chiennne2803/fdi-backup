import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTransWithdrawCashDTO} from 'app/models/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable, of} from 'rxjs';
import {ManagementWithdrawHOService} from '../../../service/admin/management-withdraw-ho.service';
import {RequestWithdrawComponent} from './components/request-withdraw/request-withdraw.component';
import {
    TABLE_BUTTON_ACTION_CONFIG_WITHDRAW,
    TABLE_WITHDRAW_CONFIG,
    TASK_BAR_CONFIG_WITHDRAW
} from './withdraw-from-ho.config';
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {ButtonConfig} from "../../../shared/models/datatable/task-bar.model";
import {FsChargeCashReqDTO} from "../../../models/service/FsChargeCashReqDTO.model";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import {FuseAlertService} from "../../../../@fuse/components/alert";

@Component({
    selector: 'app-withdraw-from-ho',
    templateUrl: './withdraw-from-ho.component.html',
    styleUrls: ['./withdraw-from-ho.component.scss']
})
export class WithdrawFromHOComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource = new Observable<BaseResponse>(null);
    public _tableConfig = TABLE_WITHDRAW_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_WITHDRAW;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_WITHDRAW;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    public detailId: number = 0;

    public wHo: number = 0;
    public totalWithdraw: number = 0;

    constructor(
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _managementWithdrawHOService: ManagementWithdrawHOService
    ) {
    }

    ngOnInit(): void {
        this._managementWithdrawHOService.prepare$.subscribe((res) => {
            if (res.payload) {
                if (res.payload.wHo != undefined) {
                    this.wHo = res.payload.wHo;
                }
                if (res.payload.totalWithdraw != undefined) {
                    this.totalWithdraw = res.payload.totalWithdraw;
                }
            }
        });
        this._dataSource = this._managementWithdrawHOService.lazyLoad;
        this._managementWithdrawHOService.doSearch().subscribe();
        this._managementWithdrawHOService.setDrawer(this.matDrawer);

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
                    const dialog = this._matDialog.open(RequestWithdrawComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                            this._managementWithdrawHOService.doSearch().subscribe((result) => {
                                this._dataSource = of(result);
                            });
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
                        const requestLock = (event.data as FsTransWithdrawCashDTO[]).map(x => x.fsTransWithdrawCashId);
                        this._managementWithdrawHOService.lockAll({ids: requestLock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._managementWithdrawHOService.prepare().subscribe();
                                this._managementWithdrawHOService.doSearch(this.searchPayload).subscribe();
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

    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => item.status !== 3).length == 0;
        let lstOtherBtn: ButtonConfig[] = [];
        if (onlyDraft) {
            lstOtherBtn.push(
                new ButtonConfig('SFF_WITHDRAW_WALLET_DELETE',
                    true,
                    false,
                    'Xoá',
                    'heroicons_outline:trash',
                    'deleted')
            );
        }
        this._btnConfig = {
            commonBtn: [
                {type: 'export', role: 'SFF_WITHDRAW_WALLET_EXPORT', fileName : 'Rut_tien_vi_tu_tai_khoan_HO'}
            ],
            otherBtn: [
                ...lstOtherBtn,
            ]
        };
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Soạn thảo', value: 3},
                            {label: 'Chờ xử lý', value: 0},
                            {label: 'Phê duyệt', value: 1},
                            {label: 'Từ chối', value: 2},
                        ], null),
                        new DateTimeFromToSearch('createdDate', 'Ngày lập', null, false),
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
                    this._managementWithdrawHOService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._managementWithdrawHOService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    public handleRowClick(event: FsTransWithdrawCashDTO): void {
        this.detailId = event.fsTransWithdrawCashId;
        this._managementWithdrawHOService.openDetailDrawer();
    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            this._managementWithdrawHOService.doSearch().subscribe((res) => {
                this._dataSource = of(res);
            });
        }
        this._managementWithdrawHOService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._managementWithdrawHOService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._managementWithdrawHOService.doSearch(this.searchPayload).subscribe();
    }
}
