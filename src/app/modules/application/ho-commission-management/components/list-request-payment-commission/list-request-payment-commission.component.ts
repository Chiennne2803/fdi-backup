import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementBonusService} from 'app/service/admin/management-bonus.service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable, of} from 'rxjs';
import {
    TABLE_BUTTON_ACTION_CONFIG_REQ_PAYMENT,
    TABLE_REQ_PAYMENT_CONFIG,
    TASK_BAR_CONFIG_REQ_PAYMENT
} from './list-request-payment-commission.config';
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {MatDialog} from "@angular/material/dialog";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {ButtonConfig, CommonButtonConfig} from "../../../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'app-list-request-payment-commission',
    templateUrl: './list-request-payment-commission.component.html',
    styleUrls: ['./list-request-payment-commission.component.scss']
})
export class ListRequestPaymentCommissionComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_REQ_PAYMENT_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_REQ_PAYMENT;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_REQ_PAYMENT;
    public detailId: number = 0;
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _matDialog: MatDialog,
        private _manageBonusReqService: ManagementBonusService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
    }

    ngOnInit(): void {
        this._manageBonusReqService.getChargeCashReq().subscribe();
        this._dataSource = this._manageBonusReqService.lazyLoad;
        this._manageBonusReqService.setDrawer(this.matDrawer);
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'payment':
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'deleted':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận xoá?',
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
                        this._manageBonusReqService.lockAll({
                            ids: (event.rowItem as FsChargeCashReqDTO[])?.map(item => item.fsChargeCashReqId)
                        }).subscribe((res) => {
                            if (res) {
                                this._manageBonusReqService.getChargeCashReq().subscribe();
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
        const hasNotDraft = rows.filter(item => item.status !== 1).length > 0;
        if (hasNotDraft) {
            this._btnConfig = {
                commonBtn: [{type : 'export', role : 'SFF_COMMISSION_PAYMENT_EXPORT', fileName : 'Xu_ly_yeu_cau_thanh_toan_hoa_hong'},],
                otherBtn: []
            };
        } else {
            this._btnConfig = TABLE_BUTTON_ACTION_CONFIG_REQ_PAYMENT;
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
                    this._manageBonusReqService.getChargeCashReq(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._manageBonusReqService.getChargeCashReq({
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

    handleRowClick(event: FsChargeCashReqDTO): void {
        this.detailId = event.fsChargeCashReqId;
        this._manageBonusReqService.getDetail({fsChargeCashReqId : this.detailId}).subscribe((res) => {
            this._manageBonusReqService.openDetailDrawer()
        });
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._manageBonusReqService.getChargeCashReq().subscribe((res) => {
                this._dataSource = of(res);
            });
        }
        this._manageBonusReqService.closeDetailDrawer();
        this.detailId = 0;
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._manageBonusReqService.getChargeCashReq(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._manageBonusReqService.getChargeCashReq(this.searchPayload).subscribe();
    }
}
