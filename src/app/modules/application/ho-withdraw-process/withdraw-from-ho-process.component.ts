import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { FsTransWithdrawCashDTO } from 'app/models/service';
import { Observable, of } from 'rxjs';
import { ManagementWithdrawHOReqService } from '../../../service/admin/management-withdraw-ho-req.service';
import { TABLE_BUTTON_ACTION_CONFIG_WITHDRAW_HO_PROCESS, TABLE_WITHDRAW_HO_PROCESS_CONFIG, TASK_BAR_CONFIG_WITHDRAW_HO_PROCESS } from './withdraw-from-ho-process.config';
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-withdraw-from-ho-process',
    templateUrl: './withdraw-from-ho-process.component.html',
    styleUrls: ['./withdraw-from-ho-process.component.scss']
})
export class WithdrawFromHOProcessComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_WITHDRAW_HO_PROCESS_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_WITHDRAW_HO_PROCESS;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_WITHDRAW_HO_PROCESS;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    public detailId: number = 0;
    public wHo: number = 0;
    public totalWithdraw: number = 0;

    constructor(
        private _matDialog: MatDialog,
        private _managementWithdrawReqService: ManagementWithdrawHOReqService
    ) {
    }

    ngOnInit(): void {
        this._dataSource = this._managementWithdrawReqService.lazyLoad;
        this._managementWithdrawReqService.setDrawer(this.matDrawer);
        this._managementWithdrawReqService.waitProcessTransaction().subscribe();
        this._managementWithdrawReqService.prepare$.subscribe((res) => {
            if (res.payload) {
                if (res.payload.wHo != undefined ) {
                    this.wHo = res.payload.wHo;
                }
                if (res.payload.totalWithdraw != undefined ) {
                    this.totalWithdraw = res.payload.totalWithdraw;
                }
            }
        });
    }

    handleRowClick(event: FsTransWithdrawCashDTO): void {
        this.detailId = event.fsTransWithdrawCashId;
        this.matDrawer.open();
    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            this._managementWithdrawReqService.waitProcessTransaction().subscribe((res) => {
                this._dataSource = of(res);
            });
        }
        this._managementWithdrawReqService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._managementWithdrawReqService.waitProcessTransaction(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._managementWithdrawReqService.waitProcessTransaction(this.searchPayload).subscribe();
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
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
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
                    this._managementWithdrawReqService.waitProcessTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._managementWithdrawReqService.waitProcessTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

}
