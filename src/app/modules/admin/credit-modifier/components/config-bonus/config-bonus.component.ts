import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {FuseAlertService} from '@fuse/components/alert';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {APP_TEXT} from 'app/shared/constants';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {TABLE_BONUS_CONFIG, TABLE_BUTTON_ACTION_CONFIG_BONUS, TASK_BAR_CONFIG_BONUS} from './config-bonus.config';
import {AddEditConfigBonusComponent} from './add-edit-config-bonus/add-edit-config-bonus.component';
import {ConfigBonusService} from '../../../../../service/admin/config-bonus.service';
import {FsConfBonusDTO} from '../../../../../models/admin/FsConfBonusDTO.model';
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch, DateTimeSearch,
    DropListSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";

/**
 * Cấu hình hoa hồng
 */
@Component({
    selector: 'app-config-bonus',
    templateUrl: './config-bonus.component.html',
    styleUrls: ['./config-bonus.component.scss']
})
export class ConfigBonusComponent implements OnInit {
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_BONUS_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_BONUS;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_BONUS;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    /**
     * constructor
     * @param _configService
     * @param _matDialog
     * @param _fuseAlertService
     */
    constructor(
        private _configBonusService: ConfigBonusService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService
    ) {
    }

    ngOnInit(): void {

        this._dataSource = this._configBonusService.lazyLoad;
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'add':
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = '50%';
                const dialog = this._matDialog.open(AddEditConfigBonusComponent, dialogConfig);
                dialog.afterClosed().subscribe((res) => {
                    if (res) {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    }
                    this._configBonusService._confBonusDetail.next(null);
                });
                return;
                break;
            default:
                break;
        }

    }

    handleRowClick(event: FsConfBonusDTO): void {
        this._tableConfig.isViewDetail = false;
        this._configBonusService.getDetail({fsConfBonusId : event.fsConfBonusId}).subscribe();

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '50%';
        dialogConfig.data = event.fsConfBonusId;
        const dialog = this._matDialog.open(AddEditConfigBonusComponent, dialogConfig);

        dialog.afterClosed().subscribe((res) => {
            if (res) {
                this._configBonusService.doSearch().subscribe();
                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
            }
            this._configBonusService._confBonusDetail.next(null);
        });
        return;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._configBonusService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._configBonusService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new DropListSearch('calcMethod', 'Hình thức tính hoa hồng', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Giá trị cố định', value: 1},
                            {label: 'Tính theo tỷ lệ', value: 2},], null, false),
                        new DropListSearch('conditionsBy', 'Điều kiện áp dụng', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Giao dịch đầu tiên', value: 1},
                            {label: 'Khoảng thời gian', value: 2},], null, false),
                        new DropListSearch('transType', 'Giao dịch hưởng hoa hồng', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Giao dịch Đầu tư', value: 1},
                            {label: 'Giao dịch Vay vốn', value: 2},], null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Áp dụng', value: 1},
                            {label: 'Ngưng áp dụng', value: 0},], null, false),
                        new InputSearch('amount', 'Số tiền (VNĐ)', null, false, 'number'),
                        new InputSearch('bonusRate', 'Tỉ lệ hoa hồng (%)', null, false),
                        new DateTimeSearch('startDateActive', 'Ngày hiệu lực', null, false),
                        new DateTimeSearch('endDateActive', 'Ngày hết hiệu lực', null, false),
                        new DateTimeFromToSearch('dateBonus', 'Khoảng thời gian tính hoa hồng', null, false)
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
                    this._configBonusService.doSearch(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._configBonusService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
