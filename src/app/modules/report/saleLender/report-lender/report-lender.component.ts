import { Component, OnInit } from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-lender.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {ReportInvestorService, ReportLenderService, ReportTopupRequestService} from '../../../../service';
import {PageEvent} from '@angular/material/paginator';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTopupDTO} from "../../../../models/service";

@Component({
  selector: 'app-report-investor-topup',
  templateUrl: './report-lender.component.html',
  styleUrls: ['./report-lender.component.scss']
})
export class ReportLenderComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            {type : 'export', role : 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_tong_hop_huy_dong_von'},
        ],
    };
    private lstStaff: IDropList[] = [];
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private isFirstLoad = true;

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportLenderService: ReportLenderService,
        private _investorService: ReportInvestorService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo tổng hợp huy động vốn';
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
        this._reportLenderService.lazyLoad.subscribe((res) => {
            if(!this.isFirstLoad) {
                this.dataSource$ =  this._reportLenderService.lazyLoad;
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
        this._reportLenderService.doSearch(this.searchPayload).subscribe();
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
        this._reportLenderService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountId', 'ID bên huy động', null, false),
                        new InputSearch('fullName', 'Bên huy động', null, false),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new InputSearch('loanTimeCycle', 'Kỳ hạn', null, false),
                        new FromToSearch('amount', 'Số tiền huy động', null, 'number'),
                        new DateTimeFromToSearch( 'investorTimeStart', 'Ngày giải ngân', null, false),
                        new DateTimeFromToSearch( 'expirDate', 'Ngày hoàn trả', null, false),
                        new FromToSearch('transpayAmount', 'Số tiền hoàn trả', null, 'number'),
                        new FromToSearch('debtAmount', 'Dư nợ', null, 'number'),
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
                    this._reportLenderService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportLenderService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
