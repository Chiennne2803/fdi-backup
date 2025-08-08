import { Component, OnInit } from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-invest.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {ReportInvestService} from '../../../../service';
import {PageEvent} from '@angular/material/paginator';
import {FsTransInvestorDTO} from "../../../../models/service";

@Component({
  selector: 'app-report-investor-topup',
  templateUrl: './report-invest.component.html',
  styleUrls: ['./report-invest.component.scss']
})
export class ReportInvestComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            {type : 'export', role : 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_dau_tu'},
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private isFirstLoad = true;

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportInvestService: ReportInvestService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo đầu tư';
        this._reportInvestService.lazyLoad.subscribe((res) => {
            if(!this.isFirstLoad) {
                this.dataSource$ =  this._reportInvestService.lazyLoad;
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
        this._reportInvestService.doSearch(this.searchPayload).subscribe();
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
        this._reportInvestService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fullName', 'Nhà đầu tư', null, false),
                        new InputSearch('admAccountId', 'ID khách hàng', null, false),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new InputSearch('lenderName', 'Bên huy động', null, false),
                        new InputSearch('investorTime', 'Kỳ hạn', null, false),
                        new DateTimeFromToSearch( 'investorTimeStart', 'Thời điểm đầu tư', null, false, undefined, undefined,0,true),
                        new FromToSearch('amount', 'Số tiền đầu tư', null, 'number'),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Chờ phê duyệt', value: 1},
                            {label: 'Đã phê duyệt', value: 2},
                            {label: 'Từ chối', value: 3},
                            {label: 'Đang đầu tư', value: 4},
                            {label: 'Kết thúc đầu tư', value: 5},
                        ], null),
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
                    this._reportInvestService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportInvestService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
