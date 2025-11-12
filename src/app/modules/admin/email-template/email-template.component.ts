import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { CheckboxColumn, IndexColumn, TextColumn, TextToolTipColumn } from 'app/shared/models/datatable/display-column.model';
import { Observable } from 'rxjs';
import { EmailTemplateService } from '../../../service/admin/email-template.service';
import { EmailTemplateDTO } from '../../../models/admin/EmailTemplateDTO.model';
import { SearchBar } from '../../../shared/models/datatable/task-bar.model';
import { ButtonTableEvent } from '../../../shared/models/datatable/table-config.model';
import { GroupSearchComponent } from '../../../shared/components/group-search/group-search.component';
import {
    DropListSearch,
    InputSearch
} from '../../../shared/components/group-search/search-config.models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmailTemplateDialogComponent } from './email-template-dialog/email-template-dialog.component';

@Component({
    selector: 'email-template',
    templateUrl: './email-template.component.html',
})
export class EmailTemplateComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public _tableConfig = {
        columnDefinition: [
            new CheckboxColumn(),
            new IndexColumn('no', 'STT', 4),
            new TextToolTipColumn('subject', 'Tiêu đề', 30, true),
            new TextColumn('createdDate', 'Ngày tạo', 12, false, 'DD/MM/YYYY'),
            new TextColumn('createdByName', 'Người tạo', 15),
            new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 12, false, 'DD/MM/YYYY'),
            new TextColumn('lastUpdatedByName', 'Người cập nhật', 15),
        ],
        title: 'Danh sách template email',
        isViewDetail: false,
        // noScroll: false
    };
    public _taskBarConfig = {
        searchBar: new SearchBar('Nhập để tìm kiếm', true),
        otherBtn: []
    };

    public _btnConfig = {
        commonBtn: [
            { type: 'export', role: '', fileName: 'Template_email' },
            { type: 'edit', role: '' },
        ],
    };
    public _dataSource: Observable<BaseResponse>;
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _emailTemplateService: EmailTemplateService,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource = this._emailTemplateService.lazyLoad;
        this._emailTemplateService.setDrawer(this.matDrawer);
        // Load dữ liệu ban đầu
        this.loadInitialData();
    }

    public handleCloseDetailPanel(event: boolean): void {
        this._tableConfig.isViewDetail = false;
        this._emailTemplateService.closeDetailDrawer();
    }

    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'edit':
                this.handleRowClick(event.rowItem);
                break;
            default:
                break;
        }
    }

    handleRowClick(event: EmailTemplateDTO): void {
        this._tableConfig.isViewDetail = false;
        this.emailTemplateDetail(event);
    }

    public emailTemplateDetail(admEmailTemplate?: EmailTemplateDTO): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        this._emailTemplateService.getDetail({ admEmailTemplateId: admEmailTemplate.admEmailTemplateId }).subscribe(res => {
            if (res) {
                dialogConfig.data = res.payload;
                const dialog = this._matDialog.open(EmailTemplateDialogComponent, dialogConfig);
                dialog.afterClosed().subscribe((res) => {
                    if (res) {
                        this.initDepartments();
                    }
                });
            }
        });

    }
    private initDepartments(): void {
        this._emailTemplateService.doSearch().subscribe();
    }
    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._emailTemplateService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._emailTemplateService.doSearch(this.searchPayload).subscribe();
    }

    private loadInitialData(): void {
        const initialRequest: BaseRequest = {
            page: 0,
            limit: 10
        };
        this._emailTemplateService.doSearch(initialRequest).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('subject', 'Tiêu đề', null, false),
                        new InputSearch('header', 'Phần mở đầu', null, false),
                        new InputSearch('body', 'Nội dung chính', null, false),
                        new InputSearch('lastUpdatedByName', 'Người cập nhật', null, false),
                        // new DropListSearch('templateType', 'Loại template', [
                        //     { value: 'WELCOME', label: 'Chào mừng' },
                        //     { value: 'NOTIFICATION', label: 'Thông báo' },
                        //     { value: 'REMINDER', label: 'Nhắc nhở' },
                        //     { value: 'CONFIRMATION', label: 'Xác nhận' }
                        // ], 'false'),
                        // new DropListSearch('status', 'Trạng thái', [
                        //     { value: 1, label: 'Hoạt động' },
                        //     { value: 0, label: 'Không hoạt động' }
                        // ], 'false'),
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
                    this._emailTemplateService.doSearch(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._emailTemplateService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
