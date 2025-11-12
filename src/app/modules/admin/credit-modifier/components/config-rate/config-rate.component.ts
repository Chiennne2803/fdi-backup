import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FuseAlertService } from '@fuse/components/alert';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { ConfRateService } from 'app/service';
import { APP_TEXT } from 'app/shared/constants';
import { ButtonTableEvent } from 'app/shared/models/datatable/table-config.model';
import { Observable } from 'rxjs';
import { AddEditConfigRateComponent } from './add-edit-config-rate/add-edit-config-rate.component';
import { TABLE_BUTTON_ACTION_CONFIG_RATE_TENURE, TABLE_RATE_TENURE_CONFIG, TASK_BAR_CONFIG_RATE_TENURE } from './config-rate.config';
import { UpdateLoanTenureComponent } from './update-loan-tenure/update-loan-tenure.component';
import {FsConfRateDTO} from '../../../../../models/service/FsConfRateDTO.model';
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";

/**
 * quan ly lai suat va ky han huy động vốn tin chap
 */
@Component({
    selector: 'app-rate-loan-tenure',
    templateUrl: './config-rate.component.html',
    styleUrls: ['./config-rate.component.scss']
})
/**
 * Quản lý lãi suất và kỳ hạn huy động vốn thế chấp
 */
export class ConfigRateComponent implements OnInit {
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_RATE_TENURE_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_RATE_TENURE;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_RATE_TENURE;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private listInvestmentTime: IDropList[] = [];
    /**
     * constructor
     * @param _confRateService
     * @param _matDialog
     * @param _fuseAlertService
     */
    constructor(
        private _confRateService: ConfRateService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService
    ) { }

    ngOnInit(): void {
        this._dataSource = this._confRateService.lazyLoad;
        this._confRateService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload.listInvestmentTime != undefined && res.payload.listInvestmentTime.length > 0) {
                this.listInvestmentTime.push({label: 'Tẩt cả', value: ''});
                res.payload.listInvestmentTime.forEach(x => this.listInvestmentTime.push({label: x, value: x}));
            }
        });
    }

    handleTableEvent(event: ButtonTableEvent): void {
        const dialogConfig = new MatDialogConfig();
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'update-rate':
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = '50%';
                const dialog1 = this._matDialog.open(UpdateLoanTenureComponent, dialogConfig);
                this._confRateService.getCreditRate().subscribe();
                dialog1.afterClosed().subscribe((res) => {
                    if (res) {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    }
                });
                break;
            case 'add':
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = '50%';
                const dialog2 = this._matDialog.open(AddEditConfigRateComponent, dialogConfig);
                dialog2.afterClosed().subscribe((res) => {
                    if (res) {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    }
                    this._confRateService._confCreditDetail.next(null);
                });
                break;
            default:
                break;
        }
    }
    handleRowClick(event: FsConfRateDTO): void {
        this._tableConfig.isViewDetail = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '65%';
        dialogConfig.data = event.fsConfRateId;
        const dialog = this._matDialog.open(AddEditConfigRateComponent, dialogConfig);
        const payload = new FsConfRateDTO();
        payload.fsConfRateId = event.fsConfRateId;
        this._confRateService.getDetail(payload).subscribe();
        dialog.afterClosed().subscribe((res) => {
            if (res) {
                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
            }
            this._confRateService._confCreditDetail.next(null);
        });
        return;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this._confRateService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._confRateService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('creditCode', 'Xếp hạng khách hàng', null, false),
                        new FromToSearch('mortgateRate', 'Lãi suất huy động vốn thế chấp(%)', null, null),
                        new DropListSearch('tenor', 'Kỳ hạn(ngày)', this.listInvestmentTime, null, false),
                        new InputSearch('fee', 'Phí(%)', null, false),
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
                    this._confRateService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._confRateService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
