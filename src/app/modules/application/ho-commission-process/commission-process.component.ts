import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseRequest } from 'app/models/base';
import { FsChargeCashReqDTO } from 'app/models/service/FsChargeCashReqDTO.model';
import { ManagementBonusReqService } from 'app/service/admin/management-bonus-req.service';
import { TextColumn } from 'app/shared/models/datatable/display-column.model';
import { TABLE_BUTTON_ACTION_CONFIG_COMMISSION_PROCESS, TABLE_COMMISSION_PROCESS_CONFIG, TASK_BAR_CONFIG_COMMISSION_PROCESS } from './commission-process.config';
import {MatDialog} from "@angular/material/dialog";
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";

@Component({
    selector: 'app-commission-process',
    templateUrl: './commission-process.component.html',
    styleUrls: ['./commission-process.component.scss']
})
export class CommissionProcessComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _dataSource  ;
    public _tableConfig = TABLE_COMMISSION_PROCESS_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_COMMISSION_PROCESS;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_COMMISSION_PROCESS;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    public detailId: number = 0;

    /**
     * constructor
     * @param _matDialog
     * @param _managementBonusReqService
     */
    constructor(
        private matDialog: MatDialog,
        private _managementBonusReqService: ManagementBonusReqService
    ) { }

    ngOnInit(): void {
        this._managementBonusReqService.setDrawer(this.matDrawer);
        this._managementBonusReqService.getApprovalChargeCashReq().subscribe();
        this._dataSource = this._managementBonusReqService.lazyLoad;
    }

    public handleRowClick(event: FsChargeCashReqDTO): void {
        this.detailId = event.fsChargeCashReqId;
        this._managementBonusReqService.getDetail({fsChargeCashReqId : this.detailId}).subscribe(res => {
            this._managementBonusReqService.openDetailDrawer();
        });
    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            this._managementBonusReqService.getApprovalChargeCashReq().subscribe();
        }
        this._managementBonusReqService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._managementBonusReqService.getApprovalChargeCashReq(this.searchPayload).subscribe();
    }
    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._managementBonusReqService.getApprovalChargeCashReq(this.searchPayload).subscribe();
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
        const dialogRef = this.matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
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
                    this._managementBonusReqService.getApprovalChargeCashReq({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._managementBonusReqService.getApprovalChargeCashReq(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
