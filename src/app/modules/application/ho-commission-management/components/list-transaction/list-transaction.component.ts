import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AdmAccountDetailDTO } from 'app/models/admin';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { ManagementBonusService } from 'app/service/admin/management-bonus.service';
import { ButtonTableEvent } from 'app/shared/models/datatable/table-config.model';
import { combineLatest, Observable, of } from 'rxjs';
import { RequestCommissionDialogComponent } from '../request-commission-dialog/request-commission-dialog.component';
import { TABLE_BUTTON_ACTION_CONFIG_COMMISSIONS, TABLE_COMMISSIONS_CONFIG, TASK_BAR_CONFIG_COMMISSIONS } from './list-transaction.config';
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch, DropListSearch,
    IDropList,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {FsConfigInvestorDTO} from "../../../../../models/service/FsConfigInvestorDTO.model";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {FsChargeCashReqDTO} from "../../../../../models/service/FsChargeCashReqDTO.model";
import {FsManageTransactionFeeDTO} from "../../../../../models/service/FsManageTransactionFeeDTO.model";
import {ISelectModel} from "../../../../../shared/models/select.model";
import {ProfileService} from "../../../../../service/common-service";

@Component({
    selector: 'app-list-transaction',
    templateUrl: './list-transaction.component.html',
    styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = TABLE_COMMISSIONS_CONFIG;
    public _taskBarConfig = TASK_BAR_CONFIG_COMMISSIONS;
    public _btnConfig = TABLE_BUTTON_ACTION_CONFIG_COMMISSIONS;
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private genders: IDropList[] = [];

    constructor(
        private _matDialog: MatDialog,
        private _manageBonusReqService: ManagementBonusService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService
    ) { }

    ngOnInit(): void {
        this._dataSource = this._manageBonusReqService.lazyLoad;
        this._manageBonusReqService.getListTransaction().subscribe();
        this._manageBonusReqService.prepareManageBonus$.subscribe((res) => {
            this.genders = res.sexCode.map(el => ({
                value: el.admCategoriesId,
                label: el.categoriesName
            }));

        });
    }


    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'payment':
                const dialogConfig = new MatDialogConfig();

                dialogConfig.autoFocus = true;
                dialogConfig.data = event.data;
                dialogConfig.disableClose = true;
                dialogConfig.width = '60%';

                setTimeout(() => {
                    const dialog = this._matDialog.open(RequestCommissionDialogComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                        }
                    });
                }, 0);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'deleted':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận hủy giao dịch hoa hồng?',
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
                        const requestLock = (event.data as FsManageTransactionFeeDTO[]).map(x => x.fsManageTransactionFeeId);
                        this._manageBonusReqService.deleteBonusFee({ids: requestLock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Hủy giao dịch thành công');
                                this._manageBonusReqService.getListTransaction(this.searchPayload).subscribe();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
    }
    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._manageBonusReqService.getListTransaction(this.searchPayload).subscribe();
    }
    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._manageBonusReqService.getListTransaction(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch( 'admAccountIdPresenterName', 'Khách hàng', null, false),
                        new DateTimeFromToSearch('transDate', 'Ngày ghi nhận', null, false),
                        new DateTimeFromToSearch('dateOfBirth', 'Ngày sinh', null, false,'DD/MM/YYYY',undefined,60000),
                        new DropListSearch('genderName', 'Giới tính', this.genders, null),
                        new InputSearch('monthDateOfBirth', 'Tháng sinh', null, false,'number'),
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
                    this._manageBonusReqService.getListTransaction(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this.searchPayload= {
                        ...this.searchPayload,
                        ...response.form.value,
                        // createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : undefined,
                    };
                    this._manageBonusReqService.getListTransaction(this.searchPayload).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    /*private initData(request?: BaseRequest): void {
        this._manageBonusReqService.getListTransaction(request).subscribe();
        this._dataSource = this._manageBonusReqService.lazyLoad;
        combineLatest([this._manageBonusReqService._listTransaction, this._manageBonusReqService._prepare]).subscribe((response) => {
            if (response[0] && response[1]) {
                const responseDatatable = response[0];
                const listAccount = response[1];
                responseDatatable.content = (responseDatatable.content as any[]).map(el => ({
                    ...el,
                    accountNameBeneficary:
                        (listAccount.payload.lstAccountApproval as AdmAccountDetailDTO[]).filter(x => x.admAccountId === el.admAccountIdBeneficiary)[0]?.accountName,
                    accountNamePresenter:
                        (listAccount.payload.lstAccountApproval as AdmAccountDetailDTO[]).filter(x => x.admAccountId === el.admAccountIdPresenter)[0]?.accountName,
                }));

                this._dataSource = of(responseDatatable);
            }
        });
    }*/
}
