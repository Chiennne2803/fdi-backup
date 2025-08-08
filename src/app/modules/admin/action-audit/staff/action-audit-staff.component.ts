import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { AdmAccessLogService } from 'app/service';
import { Observable } from 'rxjs';
import {
    TABLE_ACTION_AUDIT_CONFIG,

    TABLE_BUTTON_ACTION_CONFIG, TASK_BAR_CONFIG
} from '../action-audit.config';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeSearch,
    DropListSearch,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'action-audit-staff',
    templateUrl: './action-audit-staff.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ActionAuditStaffComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = { ...TABLE_ACTION_AUDIT_CONFIG, title: 'Giám sát truy cập nhân viên', isViewDetail: false };
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    /**
     * Constructor
     */
    constructor(
        private _admAccessLogService: AdmAccessLogService,
        private _dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._admAccessLogService.lazyLoad;
        this._admAccessLogService.setDrawer(this.detailDrawer);
    }

    public handleSearch($event: Event): void {
        this._admAccessLogService.doSearchAccessLogStaff({
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        }).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this._admAccessLogService.doSearchAccessLogStaff({
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    public handleRowClick(row: any): void {
        this._admAccessLogService
            .getDetail({ admAccessLogId: row.admAccessLogId })
            .subscribe(() => {
                this._admAccessLogService.openDetailDrawer();
            });
    }

    public handleCloseDetailPanel($event: Event): void {
        this._tableConfig.isViewDetail = false;
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
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountName', 'Tên tài khoản', null, false),
                        new InputSearch('ip', 'IP', null, false),
                        new InputSearch('device', 'Thiết bị', null, false),
                        new InputSearch('os', 'Hệ điều hành', null, false),
                        new InputSearch('browser', 'Trình duyệt sử dụng', null, false),
                        new DateTimeSearch( 'loginTime', 'Đăng nhập lần cuối', null, false),
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
                    this._admAccessLogService.doSearchAccessLogStaff({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._admAccessLogService.doSearchAccessLogStaff(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
