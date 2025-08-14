import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {CheckboxColumn, IndexColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {Observable} from 'rxjs';
import {DocumentConfigService} from '../../../service/admin/document-config.service';
import {AdmDocumentConfigDTO} from '../../../models/admin/AdmDocumentConfigDTO.model';
import {SearchBar} from "../../../shared/models/datatable/task-bar.model";
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'document-config',
    templateUrl: './document-config.component.html',
})
export class DocumentConfigComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _tableConfig = {
        columnDefinition: [
            new CheckboxColumn(),
            new IndexColumn('no', 'STT', 4),
            new TextColumn('admDocumentConfigId', 'Mã biểu mẫu', 5, true),
            new TextColumn('admDocumentConfigName', 'Tên biểu mẫu', 20, true),
            new TextColumn('createdDate', 'Ngày tạo', 15, false, 'DD/MM/YYYY'),
            new TextColumn('createdByName', 'Người tạo', 20),
            new TextColumn('lastUpdatedDate', 'Ngày cập nhật', 15, false, 'DD/MM/YYYY'),
            new TextColumn('lastUpdatedByName', 'Người cập nhật', 20),
        ],
        title: 'Danh sách cấu hình biểu mẫu',
        isViewDetail: false,
        noScroll: false
    };
    public _taskBarConfig = {
        searchBar: new SearchBar('Nhập để tìm kiếm', true),
        otherBtn: []
    };

    public _btnConfig = {
        commonBtn: [
            {type: 'export', role: '', fileName : 'Cau_hinh_bieu_mau'},
            {type: 'edit', role: ''},
        ],
    };
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    public _dataSource: Observable<BaseResponse>;

    constructor(
        private _documentConfigService: DocumentConfigService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource = this._documentConfigService.lazyLoad;
        this._documentConfigService.setDrawer(this.matDrawer);
    }

    handleCloseDetailPanel(event: boolean): void {
        this._tableConfig.isViewDetail = false;
    }

    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'edit':
                this.handleRowClick(event.rowItem);
                break
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
                        new InputSearch('admDocumentConfigId', 'Mã biểu mẫu', null, false),
                        new InputSearch('admDocumentConfigName', 'Tên biểu mẫu', null, false),
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
                    this._documentConfigService.doSearch(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._documentConfigService.doSearch({
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

    handleRowClick(event: AdmDocumentConfigDTO): void {
        this._documentConfigService
            .getDetail({admDocumentConfigId: event.admDocumentConfigId})
            .subscribe((res) => {
                this._documentConfigService.openDetailDrawer();
            });
    }

    handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._documentConfigService.doSearch(this.searchPayload).subscribe();

    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._documentConfigService.doSearch(this.searchPayload).subscribe();
    }
}
