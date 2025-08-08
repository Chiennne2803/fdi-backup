import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementCashInReqService} from 'app/service/admin/management-cash-in-req.service';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG_SUCCESS, TABLE_SUCCESS_CONFIG, TASK_BAR_CONFIG_SUCCESS} from './success-list.config';
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {MatDialog} from "@angular/material/dialog";
import {ButtonTableEvent} from "../../../../../shared/models/datatable/table-config.model";

@Component({
    selector: 'app-success-list',
    templateUrl: './success-list.component.html',
    styleUrls: ['./success-list.component.scss']
})
export class SuccessListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_SUCCESS_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_SUCCESS;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_SUCCESS;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    public detailId: number = 0;

    /**
     * constructor
     * @param _matDialog
     * @param _manageCashInReqService
     */
    constructor(
        private _matDialog: MatDialog,
        private _manageCashInReqService: ManagementCashInReqService
    ) {
    }

    ngOnInit(): void {
        this._manageCashInReqService.setDrawer(this.matDrawer);
        this._manageCashInReqService.getCashInReqApproval().subscribe();
        this._dataSource = this._manageCashInReqService.lazyLoad;
    }

    handleRowClick(event: FsChargeCashReqDTO): void {
        this.detailId = event.fsChargeCashReqId;
        this.matDrawer.open();
        this._manageCashInReqService.setShowDetail(true);
    }

    handleCloseDetailPanel(event: any): void {
        this.matDrawer.close();
        this.detailId = 0;
        this._tableConfig.isViewDetail = false;
        this._manageCashInReqService.setShowDetail(false);
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._manageCashInReqService.getCashInReqApproval(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._manageCashInReqService.getCashInReqApproval(this.searchPayload).subscribe();
    }


    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
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
                        new DropListSearch('transType', 'Loại yêu cầu', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Tiếp quỹ tiền điện tử', value: 3},
                            {label: 'Tiếp quỹ tiền mặt', value: 2},
                        ], null),
                        new DateTimeFromToSearch('createdDate', 'Ngày lập', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Đã phê duyệt', value: 3},
                            {label: 'Từ chối', value: 4},
                            {label: 'Chờ hạch toán', value: 5},
                            {label: 'Thành công', value: 6},
                        ], null),
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
                    this._manageCashInReqService.getCashInReqApproval({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._manageCashInReqService.getCashInReqApproval(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
