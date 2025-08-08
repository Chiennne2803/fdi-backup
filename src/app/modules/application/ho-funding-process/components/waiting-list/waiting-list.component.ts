import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementCashInReqService} from 'app/service/admin/management-cash-in-req.service';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {Observable, of} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG_WAITING, TABLE_WAITING_CONFIG, TASK_BAR_CONFIG_WAITING} from './waiting-list.config';
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
    selector: 'app-waiting-list',
    templateUrl: './waiting-list.component.html',
    styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_WAITING_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_WAITING;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_WAITING;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    public detailId: number = 0;

    /**
     * constructor
     * @param _manageCashInReqService
     */
    constructor(
        private _matDialog: MatDialog,
        private _manageCashInReqService: ManagementCashInReqService
    ) {
    }

    ngOnInit(): void {
        this._manageCashInReqService.setDrawer(this.matDrawer);
        this._manageCashInReqService.getCashInReqWaitingProgressing().subscribe();
        this._dataSource = this._manageCashInReqService.lazyLoad;
    }

    handleRowClick(event: FsChargeCashReqDTO): void {
        this.detailId = event.fsChargeCashReqId;
        this.matDrawer.open();
        this._manageCashInReqService.setShowDetail(true);
    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            this._manageCashInReqService.getCashInReqWaitingProgressing().subscribe((res) => {
                this._dataSource = of(res);
            });
        }
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
        this._manageCashInReqService.getCashInReqWaitingProgressing(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._manageCashInReqService.getCashInReqWaitingProgressing(this.searchPayload).subscribe();
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
                    this._manageCashInReqService.getCashInReqWaitingProgressing({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._manageCashInReqService.getCashInReqWaitingProgressing(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
