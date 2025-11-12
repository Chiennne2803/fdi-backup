import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {AdmGroupRoleDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {DecentralizedService} from 'app/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_ACTION_CONFIG_ROLE, TABLE_ROLE_CONFIG, TASK_BAR_CONFIG_ROLE} from './role-management.config';
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {MatDialog} from "@angular/material/dialog";
import {ADM_GROUP_ROLE_STATUS} from "../../../enum/adm-group-role.enum";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {CommonButtonConfig} from "../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'app-role-management',
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _dataSource = new Observable<BaseResponse>(null);
    public _tableConfig = TABLE_ROLE_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_ROLE;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_ROLE;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    // public detailId = 0;

    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _decentralizedService: DecentralizedService
    ) { }

    ngOnInit(): void {
        this._decentralizedService.setDrawer(this.matDrawer);
        this.initData();
    }

    handleRowClick(event: AdmGroupRoleDTO): void {
        this._decentralizedService.getDetail({admGroupRoleId : event.admGroupRoleId}).subscribe(res => {
            this._decentralizedService.openDetailDrawer();
            this._tableConfig.isViewDetail = true;
        });
    }

    handleCloseDetailPanel(event: any): void {
        if (event) {
            // this.detailId = 0;
            this.initData();
        }
        this._decentralizedService.closeDetailDrawer();
        this._tableConfig.isViewDetail = false;
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this._decentralizedService.initAdvanceTab().subscribe(res => {
                    if (res) {
                        this._tableConfig.isViewDetail = true;
                        // this.detailId = 0;
                        this._decentralizedService.openDetailDrawer();
                    }
                });
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'edit' :
                this.handleRowClick(event.rowItem);
                break;
            case 'lock':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận khoá nhóm quyền?',
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
                        this._decentralizedService.lockAll({
                            ids: (event.rowItem as AdmGroupRoleDTO[])?.map(item => item.admGroupRoleId)
                        }).subscribe((res) => {
                            if (res) {
                                this._fuseAlertService.showMessageSuccess("QLPQ018")
                                this._decentralizedService.doSearch(this.searchPayload).subscribe();
                            }
                        });
                    }
                });
                break;
            case 'unlock':
                const dialogRef2 = this._fuseConfirmationService.open({
                    title: 'Xác nhận mở khoá nhóm quyền?',
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
                dialogRef2.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        this._decentralizedService.unlockAll({
                            ids: (event.rowItem as AdmGroupRoleDTO[])?.map(item => item.admGroupRoleId)
                        }).subscribe((res) => {
                            if (res) {
                                this._fuseAlertService.showMessageSuccess("QLPQ019")
                                this._decentralizedService.doSearch(this.searchPayload).subscribe();
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
        const onlyActive = rows.filter(item => (item.status !== 1)).length == 0;
        const onlyDeActive = rows.filter(item => item.status !== 0).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if(onlyActive) {
            lstCommonBtn.push( {type : 'edit', role : 'SFF_DECENTRALIZED_UPDATE'});
            lstCommonBtn.push( {type: 'lock', role: 'SFF_DECENTRALIZED_UPDATE'});
        }
        if(onlyDeActive) {
            lstCommonBtn.push({type: 'unlock', role: 'SFF_DECENTRALIZED_UPDATE'});
        }
        this._btnConfig = {
            commonBtn: [
                {type: 'export', role: 'SFF_DIRECTORY_DATA_EXPORT', fileName : 'Quan_ly_phan_quyen'},
                ...lstCommonBtn,
            ]
        };

    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._decentralizedService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._decentralizedService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('groupRoleName', 'Tên nhóm quyền', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Hoạt động', value: ADM_GROUP_ROLE_STATUS.ACTIVE},
                            {label: 'Không hoạt động', value: ADM_GROUP_ROLE_STATUS.DEACTIVE}
                        ], null),
                        new DateTimeFromToSearch('activeDate', 'Thời gian hiệu lực', null, false),
                        new InputSearch('createdByName', 'Người Tạo', null, false),
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
                    this._decentralizedService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._decentralizedService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    private initData(request?: any): void {
        this._decentralizedService.doSearch(request).subscribe();
        this._dataSource = this._decentralizedService.lazyLoad;
    }

}
