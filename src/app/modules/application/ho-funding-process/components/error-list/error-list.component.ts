import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTopupMailTransferDTO} from 'app/models/service';
import {ManagementCashInReqService} from 'app/service/admin/management-cash-in-req.service';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG_ERROR, TABLE_ERROR_CONFIG, TASK_BAR_CONFIG_ERROR} from './error-list.config';
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ButtonTableEvent} from "../../../../../shared/models/datatable/table-config.model";

@Component({
    selector: 'app-error-list',
    templateUrl: './error-list.component.html',
    styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_ERROR_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_ERROR;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_ERROR;
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
        this._manageCashInReqService.getCashInReqError().subscribe();
        this._dataSource = this._manageCashInReqService.lazyLoad;
    }

    handleRowClick(event: FsTopupMailTransferDTO): void {
        this.detailId = event.fsTopupMailTransferId;
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
        this._manageCashInReqService.getCashInReqError(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._manageCashInReqService.getCashInReqError(this.searchPayload).subscribe();
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
                            {label: 'Không xác định được yêu cầu tiếp quỹ tiền mặt', value: 7},
                            {label: 'Số tiền giao dịch không hợp lệ', value: 3},
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
                    this._manageCashInReqService.getCashInReqError({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._manageCashInReqService.getCashInReqError(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

}
