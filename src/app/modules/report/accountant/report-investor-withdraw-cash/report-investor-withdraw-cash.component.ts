import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from "@angular/material/paginator";
import { BaseRequest, BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import { ReportWithdrawCashService } from '../../../../service';
import { DialogService } from '../../../../service/common-service/dialog.service';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { TABLE_STATISTICAL_REPORT_INVESTOR_WITHDRAWAL_CONFIG, TASK_BAR_STATISTICAL_REPORT_CONFIG } from "./report-investor-withdraw-cash.config";

@Component({
    selector: 'app-report-investor-withdraw-cash',
    templateUrl: './report-investor-withdraw-cash.component.html',
    styleUrls: ['./report-investor-withdraw-cash.component.scss']
})
export class ReportInvestorWithdrawCashComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_WITHDRAWAL_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Ngay_rut_tien' },
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _reportWithdrawCashService: ReportWithdrawCashService,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo rút tiền của nhà đầu tư';
        this._reportWithdrawCashService.lazyLoad.subscribe((res) => {
            this.dataSource$ = this._reportWithdrawCashService.lazyLoad;
        });

    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportWithdrawCashService.doSearch(this.searchPayload).subscribe();
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

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountIdRecipientName', 'Tên cá nhân/ Doanh nghiệp', null, false),
                        new InputSearch('admAccountIdRecipient', 'ID khách hàng', null, false),
                        new DateTimeFromToSearch('createdDate', 'Ngày rút tiền', null, false, undefined, undefined, 0, true),
                        new FromToSearch('amount', 'Số tiền', null, 'number'),
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
                    this._reportWithdrawCashService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportWithdrawCashService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._reportWithdrawCashService.doSearch(this.searchPayload).subscribe();
    }
}
