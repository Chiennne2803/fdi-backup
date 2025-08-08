import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {DepartmentsService} from 'app/service';
import {Observable, of} from 'rxjs';
import {TABLE_ACCOUNT_CONFIG, TABLE_BUTTON_ACTION_CONFIG, TASK_BAR_CONFIG} from './departments.config';
import {AdmDepartmentsDTO} from "../../../models/admin";
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DepartmentDialogComponent} from "./department-dialog/department-dialog.component";
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DropListSearch, IDropList,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";

@Component({
    selector: 'app-departments',
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
    public _tableConfig = TABLE_ACCOUNT_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG;
    public _dataSource: Observable<BaseResponse>;
    public admDepartmentsId: number = 0;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private _listUser: IDropList[] = [];

    constructor(
        public _departmentsService: DepartmentsService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._tableConfig.columnDefinition[0].alignCenter = true;
        this._departmentsService.doSearch().subscribe();
        this._dataSource = this._departmentsService.lazyLoad;
        this._departmentsService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload.lstUser != undefined && res.payload.lstUser.length > 0) {
                this._listUser.push({label: 'Tẩt cả', value: null});
                res.payload.lstUser.forEach(el => this._listUser.push({
                    label: el.accountName + ' - ' + el.fullName,
                    value: el.admAccountId
                }));
            }
        });
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._departmentsService.doSearch().subscribe((res) => {
                this._dataSource = of(res);
            });
        }
        this._tableConfig.isViewDetail = false;
    }

    handleRowClick(event: AdmDepartmentsDTO): void {
        this._tableConfig.isViewDetail = false;
        this.departmentDetail(event);
    }


    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                // this.viewDetail.emit(new ButtonTableEvent('add'));
                this.departmentDetail();
                break;
            case 'edit':
            case 'lock':
            case 'unlock':
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._departmentsService.doSearch(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._departmentsService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admDepartmentsCode', 'Mã phòng ban', null, false),
                        new InputSearch('departmentName', 'Tên phòng ban', null, false),
                        new DropListSearch('admAccountId', 'Trưởng phòng ban', this._listUser, null, false)
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
                    this._departmentsService.doSearch(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._departmentsService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload,
                        createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : undefined,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }


    public departmentDetail(departmentId?: AdmDepartmentsDTO): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        if (departmentId) {
            this._departmentsService.getDetail({admDepartmentsId: departmentId.admDepartmentsId}).subscribe(res => {
                if (res) {
                    dialogConfig.data = res.payload;
                    const dialog = this._matDialog.open(DepartmentDialogComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                            this.initDepartments();
                        }
                    });
                }
            });
        } else {
            this._departmentsService._departmentDetail.next(new AdmDepartmentsDTO())
            dialogConfig.data = null;
            const dialog = this._matDialog.open(DepartmentDialogComponent, dialogConfig);
            dialog.afterClosed().subscribe((res) => {
                if (res) {
                    this.initDepartments();
                }
            });
        }

    }

    private initDepartments(): void {
        this._departmentsService.doSearch().subscribe();
    }

    public onButtonActionClick(row: any): void {
        this.departmentDetail(row);
    }
}
