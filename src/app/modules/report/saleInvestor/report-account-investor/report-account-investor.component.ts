import { Component, OnInit } from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-account-investor.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {ReportAccountInvestorService, ReportInvestorService} from '../../../../service';
import {PageEvent} from '@angular/material/paginator';
import {FsTopupDTO} from "../../../../models/service";
import {IndexColumn, TextColumn} from "../../../../shared/models/datatable/display-column.model";

@Component({
  selector: 'app-report-investor-topup',
  templateUrl: './report-account-investor.component.html',
  styleUrls: ['./report-account-investor.component.scss']
})
export class ReportAccountInvestorComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            {type : 'export', role : 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_tai_khoan_nha_dau_tu'},
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private isFirstLoad = true;
    private lstStaff: IDropList[] = [];

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportAccountInvestorService: ReportAccountInvestorService,
        private _reportInvestorService: ReportInvestorService,

    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo tài khoản nhà đầu tư';
        this._reportInvestorService.getPrepareLoadingPage().subscribe(ret => {
            if (ret) {
                this.lstStaff = [];
                this.lstStaff.push({label: 'Tẩt cả', value: null});
                ret.payload.lstStaff.forEach(el => this.lstStaff.push({
                    label: el.fullName,
                    value: el.admAccountDetailId
                }));
            }
        });
        this._reportAccountInvestorService.lazyLoad.subscribe((res) => {
            if(!this.isFirstLoad) {
                this.dataSource$ =  this._reportAccountInvestorService.lazyLoad;
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
        this._reportAccountInvestorService.doSearch(this.searchPayload).subscribe();
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
        this._reportAccountInvestorService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fullName', 'Nhà đầu tư', null),
                        new InputSearch('admAccountId', 'ID', null),
                        new DateTimeFromToSearch( 'transDate', 'Thời gian', null, false, undefined, undefined,0 ,true),
                        new FromToSearch('topupAmount', 'Nạp tiền', null, 'number'),
                        new FromToSearch('withdrawAmount', 'Rút tiền', null, 'number'),
                        new FromToSearch('investAmount', 'Đầu tư', null, 'number'),
                        new FromToSearch('weu', 'Số dư khả dụng', null, 'number'),
                        new DropListSearch('manageStaffName', 'Nhân viên quản lý',this.lstStaff, null),
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
                    this._reportAccountInvestorService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    if(response.form.value?.manageStaffName) {
                        response.form.value.manageStaffName = this.lstStaff.find(staff => staff.value === response.form.value?.manageStaffName).label
                    }
                    this._reportAccountInvestorService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
