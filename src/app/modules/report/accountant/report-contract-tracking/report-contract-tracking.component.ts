import { Component, OnInit } from '@angular/core';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import { Observable } from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-contract-tracking.config';
import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { ReportContractTrackingService } from '../../../../service';
import { PageEvent } from '@angular/material/paginator';
import { FsTopupDTO } from "../../../../models/service";

@Component({
    selector: 'app-report-investor-topup',
    templateUrl: './report-contract-tracking.component.html',
    styleUrls: ['./report-contract-tracking.component.scss']
})
export class ReportContractTrackingComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Bao_cao_theo_doi_ke_uoc' },
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportContractTrackingService: ReportContractTrackingService
    ) {
    }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo theo dõi khế ước';
        this._reportContractTrackingService.lazyLoad.subscribe((res) => {
            this.dataSource$ = this._reportContractTrackingService.lazyLoad;
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportContractTrackingService.doSearch(this.searchPayload).subscribe();
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
        this._reportContractTrackingService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsTransInvestorId', 'Số hồ sơ đầu tư', null, false),
                        new DateTimeFromToSearch('investorTimeStart', 'Ngày đầu tư', null, false),
                        new InputSearch('admAccountId', 'ID khách hàng', null, false),
                        new InputSearch('investorName', 'Tên khách hàng', null, false),
                        new InputSearch('lenderName', 'Bên huy động', null, false),
                        new InputSearch('taxCode', 'Mã số thuế', null, false),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new FromToSearch('amount', 'Số tiền đầu tư', null, 'number'),
                        new DateTimeFromToSearch('investorTimeExpried', 'Ngày hoàn trả dự kiến', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            { label: 'Tẩt cả', value: '' },
                            { label: 'Đang đầu tư', value: 4 },
                            { label: 'Kết thúc đầu tư ', value: 5 },
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
                    this._reportContractTrackingService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportContractTrackingService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
