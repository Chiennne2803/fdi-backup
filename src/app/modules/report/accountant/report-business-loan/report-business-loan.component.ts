import { Component, OnInit } from '@angular/core';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import { Observable } from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-business-loan.config';
import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { ReportBusinessLoanService, ReportTopupRequestService } from '../../../../service';
import { PageEvent } from '@angular/material/paginator';
import { FsCardDownDTO, FsTopupDTO } from "../../../../models/service";

@Component({
    selector: 'app-report-investor-topup',
    templateUrl: './report-business-loan.component.html',
    styleUrls: ['./report-business-loan.component.scss']
})
export class ReportBusinessLoanComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Bao_cao_du_no_doanh_nghiep_huy_dong_von' },
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _service: ReportBusinessLoanService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo dư nợ doanh nghiệp huy động vốn';
        this._service.lazyLoad.subscribe((res) => {
            this.dataSource$ = this._service.lazyLoad;
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._service.doSearch(this.searchPayload).subscribe();
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
        this._service.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fullName', 'Bên huy động vốn', null, false),
                        new InputSearch('fsLoanProfilesId', 'Hồ sơ huy động vốn', null, false),
                        new FromToSearch('amount', 'Tổng gốc huy động', null, 'number'),
                        new FromToSearch('payOriginal', 'Tổng gốc hoàn trả', null, 'number'),
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
                    this._service.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._service.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
