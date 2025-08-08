import { Component, OnInit } from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-investor.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {ReportInvestorService} from '../../../../service';
import {PageEvent} from '@angular/material/paginator';
import {AdmAccountDetailDTO} from "../../../../models/admin";

@Component({
  selector: 'app-report-investor-topup',
  templateUrl: './report-investor.component.html',
  styleUrls: ['./report-investor.component.scss']
})
export class ReportInvestorComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            {type : 'export', role : 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_nha_dau_tu_ca_nhan'},
        ],
    };

    private lstStaff: IDropList[] = [];
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private isFirstLoad = true;

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _investorService: ReportInvestorService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo nhà đầu tư cá nhân';
        this._investorService.getPrepareLoadingPage().subscribe(ret => {
            if (ret) {
                this.lstStaff = [];
                this.lstStaff.push({label: 'Tẩt cả', value: null});
                ret.payload.lstStaff.forEach(el => this.lstStaff.push({
                    label: el.fullName,
                    value: el.admAccountDetailId
                }));
            }
        });
        this._investorService.lazyLoad.subscribe((res) => {
            if(!this.isFirstLoad) {
                this.dataSource$ =  this._investorService.lazyLoad;
            } else {
                this.isFirstLoad = false;
            }
        });

    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._investorService.doSearch(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._investorService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountId', 'ID nhà đầu tư', null, false),
                        new InputSearch('fullName', 'Tên nhà đầu tư', null, false),
                        new InputSearch('accountName', 'Tên tài khoản', null, false),
                        new FromToSearch('topupAmount', 'Số tiền đã nạp', null, 'number'),
                        new FromToSearch('investAmount', 'Số tiền đang đầu tư', null, 'number'),
                        new FromToSearch('withdrawAmount', 'Số tiền đã rút', null, 'number'),
                        new FromToSearch('preWithdrawAmount', 'Lệnh rút tiền chờ xử lý ', null, 'number'),
                        new FromToSearch('weu', 'Số dư khả dụng', null, 'number'),
                        new DropListSearch('manageStaff', 'Nhân viên phụ trách', this.lstStaff, null),
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
                    this._investorService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._investorService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
