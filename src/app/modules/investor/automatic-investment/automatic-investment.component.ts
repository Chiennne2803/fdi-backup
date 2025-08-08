import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import { FuseAlertService } from '../../../../@fuse/components/alert';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { FsConfigInvestorDTO } from '../../../models/service/FsConfigInvestorDTO.model';
import { WControlEuDTO } from '../../../models/wallet/WControlEuDTO.model';
import { ConfigInvestorService } from '../../../service/admin/config-investor.service';
import { GroupSearchComponent } from '../../../shared/components/group-search/group-search.component';
import {
    DateTimeSearch,
    DropListSearch, FromToSearch
} from '../../../shared/components/group-search/search-config.models';
import { ButtonTableEvent } from '../../../shared/models/datatable/table-config.model';
import {
    TABLE_AUTOMATIC_INVESTMENT_CONFIG,
    TABLE_BUTTON_ACTION_CONFIG,
    TASK_BAR_CONFIG
} from './automatic-investment.config';

@Component({
  selector: 'app-automatic-investment',
  templateUrl: './automatic-investment.component.html',
  styleUrls: ['./automatic-investment.component.scss']
})
export class AutomaticInvestmentComponent implements OnInit {
    tableConfig = TABLE_AUTOMATIC_INVESTMENT_CONFIG;
    taskBarConfig = TASK_BAR_CONFIG;
    tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG;
    dataSource$: Observable<BaseResponse>;
    wControlEu: WControlEuDTO;
    listInvestmentTime: number[];
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    constructor(
        private _autoInvestmentService: ConfigInvestorService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
    	this._autoInvestmentService.prepare().subscribe();
        this.dataSource$ = this._autoInvestmentService.lazyLoad;
        this._autoInvestmentService._dataPrepare.subscribe((res) => {
            if (res) {
                this.wControlEu = res.wControlEuDTO;
                this.listInvestmentTime = res.listInvestmentTime;
            }
        });
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this.reSubscribeData();
    }

    handleRowClick(event: FsConfigInvestorDTO): void {
this.tableConfig.isViewDetail = false;
    }

    reSubscribeData(): void {
        this._autoInvestmentService.doSearch(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._autoInvestmentService.doSearch(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'deleted':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận hủy đầu tư tự động?',
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
                        const requestLock = (event.data as FsConfigInvestorDTO[]).map(x => x.fsConfigInvestorId);
                        this._autoInvestmentService.lockAll({ids: requestLock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Hủy đầu tư tự động thành công');
                                this._autoInvestmentService.doSearch(this.searchPayload).subscribe();
                                this._autoInvestmentService.prepare().subscribe();
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

    checkBoxItemChange(rows): void {
        const isShowCancelBtn = rows.filter(item => item.status !== 1).length === 0;
        if (isShowCancelBtn) {
            this.tableBtnConfig = {...TABLE_BUTTON_ACTION_CONFIG};
        } else {
            this.tableBtnConfig = {
                ...TABLE_BUTTON_ACTION_CONFIG,
                otherBtn: [],
            };
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            disableClose: true,
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new DropListSearch('investmentTime', 'Kỳ hạn(ngày)', this.listInvestmentTime.map(item => ({
                                label: item.toString(),
                                value: item,
                            })), null,false),
                        new FromToSearch('investmentAmount', 'Tổng số tiền đã đặt lệnh đầu tư (VNĐ)', null, 'number'),
                        new FromToSearch('preMatchingAmount', 'Số tiền đang chờ khớp lệnh (VNĐ)', null, 'number'),
                        new FromToSearch('matchingAmount', 'Số tiền đã được khớp lệnh (VNĐ)', null, 'number'),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tất cả', value: ''},
                            {label: 'Đang đầu tư', value: 1},
                            {label: 'Hoàn thành', value: 2},
                            {label: 'Huỷ chủ động', value: 3},
                            {label: 'Huỷ do hết hạn niêm yết', value: 4},
                        ], null,false),
                        new DateTimeSearch('createdDate', 'Ngày tạo', null, false),
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
                    this._autoInvestmentService.doSearch().subscribe();
                } else if (response.action === 'search') {
                    this._autoInvestmentService.doSearch({
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
}
