import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Observable, of } from 'rxjs';
import { DialogService } from './../../../service/common-service/dialog.service';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { GroupSearchComponent } from 'app/shared/components/group-search/group-search.component';
import { DropListSearch, InputSearch } from 'app/shared/components/group-search/search-config.models';
import { SpNotificationConfigDTO } from './../../../models/service/SpNotificationConfigDTO.model';
import { NotificationConfigService } from './../../../service/admin/notification-config.service';
import { ButtonTableEvent } from './../../../shared/models/datatable/table-config.model';
import { SettingNotificationDetailComponent } from './components/setting-notification-detail/setting-notification-detail.component';
import { TABLE_BUTTON_ACTION_CONFIG_SETTING_NOTI, TABLE_SETTING_NOTI_CONFIG, TASK_BAR_CONFIG_SETTING_NOTI } from './setting-notification.config';
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {CommonButtonConfig} from "../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'app-setting-notification',
    templateUrl: './setting-notification.component.html',
    styleUrls: ['./setting-notification.component.scss']
})
export class SettingNotificationComponent implements OnInit {

    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_SETTING_NOTI_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_SETTING_NOTI;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_SETTING_NOTI;

    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    constructor(
        private _settingNotifyService: NotificationConfigService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _dialogService: DialogService
    ) { }

    ngOnInit(): void {
        this.initData();
    }

    private initData() {
        this._settingNotifyService.doSearch().subscribe();
        this._dataSource = this._settingNotifyService.lazyLoad;
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._settingNotifyService.doSearch(this.searchPayload).subscribe();
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._settingNotifyService.doSearch();
        }
        this._tableConfig.isViewDetail = false;
    }

    handleRowClick(event: SpNotificationConfigDTO): void {
        this.notificationDetail(event);
        this._tableConfig.isViewDetail = false;
    }

    handlePageSwitch(event: PageEvent): void {
        const request: BaseRequest = new BaseRequest();
        request.limit = event.pageSize;
        request.page = event.pageIndex;
        this._settingNotifyService.doSearch(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.notificationDetail();
                break;
            case 'edit':
                this.notificationDetail(event.rowItem);
                break;
            case 'deleted':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận xoá?',
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
                        this._settingNotifyService.lockAll({
                            ids: (event.rowItem as SpNotificationConfigDTO[])?.map(item => item.spNotificationConfigId)
                        }).subscribe((res) => {
                            if (res) {
                                this._fuseAlertService.showMessageSuccess("Xóa thành công");
                                this._settingNotifyService.doSearch().subscribe();
                            }
                        });
                    }
                });
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
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
            lstCommonBtn.push( {type: 'deleted', role: 'SFF_CONFIGURING_ALERTS_DELETE'});
        }
        if(onlyDeActive) {
            //khong cho unlock
            // lstCommonBtn.push({type: 'unlock', role: 'SFF_CONFIGURING_ALERTS_UPDATE'});
        }
        this._btnConfig = {
            commonBtn: [
                {type: 'export', role: 'SFF_CONFIGURING_ALERTS_EXPORT'},
                {type : 'edit', role : 'SFF_CONFIGURING_ALERTS_UPDATE'},
                ...lstCommonBtn,
            ]
        };
    }

    public notificationDetail(noti?: SpNotificationConfigDTO): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '65%';
        if (noti) {
            this._settingNotifyService.getDetail({spNotificationConfigId: noti.spNotificationConfigId}).subscribe(res => {
                if (res) {
                    dialogConfig.data = res.payload;
                    const dialog = this._matDialog.open(SettingNotificationDetailComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                            this.initNotification();
                        }
                    });
                }
            });
        } else {
            dialogConfig.data = new SpNotificationConfigDTO();
            const dialog = this._matDialog.open(SettingNotificationDetailComponent, dialogConfig);
            dialog.afterClosed().subscribe((res) => {
                if (res) {
                    this.initNotification();
                }
            });
        }

    }

    private initNotification(): void {
        this._settingNotifyService.doSearch().subscribe();
    }

    public onButtonActionClick(row: any): void {
        this.notificationDetail(row);
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('configName', 'Tên thông báo', null, false),
                        new InputSearch('title', 'Tiêu đề', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Hoạt động', value: 1},
                            {label: 'Không hoạt động', value: 2},
                        ], null)
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
                    this._settingNotifyService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._settingNotifyService.doSearch({
                        ...this.searchPayload,
                        ...response.form.value
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }


}
