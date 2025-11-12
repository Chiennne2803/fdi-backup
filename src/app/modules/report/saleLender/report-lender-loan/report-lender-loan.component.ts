import { Component, OnInit } from '@angular/core';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import { Observable } from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-lender-loan.config';
import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { ReportLenderLoanService, ReportTopupRequestService } from '../../../../service';
import { PageEvent } from '@angular/material/paginator';
import { FsLoanProfilesDTO, FsTopupDTO } from "../../../../models/service";

@Component({
    selector: 'app-report-investor-topup',
    templateUrl: './report-lender-loan.component.html',
    styleUrls: ['./report-lender-loan.component.scss']
})
export class ReportLenderLoanComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Bao_cao_huy_dong_moi' },
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportLenderLoanService: ReportLenderLoanService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo huy động mới';
        this._reportLenderLoanService.lazyLoad.subscribe((res) => {
            this.dataSource$ = this._reportLenderLoanService.lazyLoad;
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportLenderLoanService.doSearch(this.searchPayload).subscribe();
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
        this._reportLenderLoanService.doSearch(this.searchPayload).subscribe();
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
                        new DateTimeFromToSearch('investorTimeStart', 'Ngày giải ngân', null, false, undefined, undefined, 0, true),
                        new FromToSearch('carddownAmount', 'Số tiền giải ngân', null, 'number'),
                        new FromToSearch('debtAmount', 'Dư nợ', null, 'number'),
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
                    this._reportLenderLoanService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportLenderLoanService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
