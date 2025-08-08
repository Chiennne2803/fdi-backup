import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {FuseAlertService} from '@fuse/components/alert';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ConfCreditService} from 'app/service';
import {APP_TEXT} from 'app/shared/constants';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {AddEditConfCreditComponent} from './add-edit-conf-credit/add-edit-conf-credit.component';
import {TABLE_BUTTON_ACTION_CONFIG_RANKS, TABLE_RANKS_CONFIG, TASK_BAR_CONFIG_RANKS} from './conf-credit.config';
import {FsConfCreditDTO} from "../../../../../models/service/FsConfCreditDTO.model";
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {InputSearch} from "../../../../../shared/components/group-search/search-config.models";
import {DialogService} from "../../../../../service/common-service/dialog.service";

/**
 * quan ly han muc xep hang tin dung
 */
@Component({
    selector: 'app-conf-credit',
    templateUrl: './conf-credit.component.html',
    styleUrls: ['./conf-credit.component.scss']
})
export class ConfCreditComponent implements OnInit {
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_RANKS_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_RANKS;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_RANKS;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    /**
     * constructor
     * @param _configService
     * @param _matDialog
     * @param _fuseAlertService
     */
    constructor(
        private _configService: ConfCreditService,
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService
    ) { }

    ngOnInit(): void {
        this._dataSource = this._configService.lazyLoad;
    }

    handleRowClick(event: FsConfCreditDTO): void {
        this._tableConfig.isViewDetail = false;
        const request = new FsConfCreditDTO();
        request.fsConfCreditId = event.fsConfCreditId;
        this._configService.getDetail(request).subscribe();

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.data = event.fsConfCreditId;
        dialogConfig.width = '65%';
        const dialog = this._matDialog.open(AddEditConfCreditComponent, dialogConfig);
        dialog.afterClosed().subscribe((res) => {
            if (res) {
                // this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
            }
            this._configService._configCreditDetail.next(null);
        });
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = '65%';
                const dialog = this._matDialog.open(AddEditConfCreditComponent, dialogConfig);
                dialog.afterClosed().subscribe((res) => {
                    if (res) {
                    }
                    this._configService._configCreditDetail.next(null);
                });
                break;
            case 'edit':
                this.doUpdateDefault(event.rowItem);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }


    private doUpdateDefault(confCreditDTO?: FsConfCreditDTO) {
        if (confCreditDTO.type == 1) {
            const cfDialog = this._dialogService.openWarningDialog(
                'Xếp hạng khách hàng đã được thiết lập là mặc định'
            );
        } else {
            const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận thiết lập phân hạng mặc định');
            confirmDialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._configService.setDefaultFsConfCredit({fsConfCreditId: confCreditDTO.fsConfCreditId}).subscribe((response) => {
                        if (response.errorCode === '0') {
                            this._configService.doSearch(this.searchPayload).subscribe();
                            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        } else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                    });
                }
            });
        }
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._configService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._configService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('creditCode', 'Xếp hạng khách hàng', null, false),
                        new InputSearch('minValue', 'Điểm tối thiểu', null, false),
                        new InputSearch('maxValue', 'Điểm tối đa', null, false),
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
                    this._configService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._configService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
