import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRequest, BaseResponse } from '../../../../models/base';
import { DialogService } from '../../../../service/common-service/dialog.service';
import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { ReportTranspayRequestService } from '../../../../service';
import { PageEvent } from '@angular/material/paginator';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { TABLE_STATISTICAL_REPORT_BUSINESS_CONFIG, TASK_BAR_STATISTICAL_REPORT_CONFIG } from "./report-transpay-request.config";

@Component({
    selector: 'app-report-transpay-request',
    templateUrl: './report-transpay-request.component.html',
    styleUrls: ['./report-transpay-request.component.scss']
})
export class ReportTranspayRequestComponent implements OnInit {

    _dataSource$: Observable<BaseResponse>;
    _tableConfig = TABLE_STATISTICAL_REPORT_BUSINESS_CONFIG;
    _taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Bao_cao_giai_ngan_va_hoa_tra' },
        ],
    };
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportTranspayReqService: ReportTranspayRequestService
    ) { }

    ngOnInit(): void {
        this._tableConfig.title = 'Báo cáo giải ngân và hoàn trả';
        this._reportTranspayReqService.lazyLoad.subscribe((res) => {
            this._dataSource$ = this._reportTranspayReqService.lazyLoad;
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportTranspayReqService.doSearch(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._reportTranspayReqService.doSearch(this.searchPayload).subscribe();
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
                        new InputSearch('tax', 'Mã số thuế DN/ cá nhân', null),
                        new InputSearch('lenderName', 'Bên huy động', null, false),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new FromToSearch('amount', 'Số tiền huy động', null, 'number'),
                        new InputSearch('investorId', 'Mã giải ngân', null, false),
                        new DateTimeFromToSearch('createdDate', 'Ngày giải ngân', null, false),
                        new FromToSearch('carddownAmount', 'Số tiền giải ngân', null, 'number'),
                        new InputSearch('transpayId', 'Mã hoàn trả', null, false),
                        new DateTimeFromToSearch('expirDate', 'Ngày hoàn trả', null, false),
                        new FromToSearch('payOriginal', 'Hoàn trả gốc', null, 'number'),
                        new FromToSearch('payInterest', 'Hoàn trả lãi', null, 'number'),
                        new FromToSearch('interestAfterTax', 'Hoàn trả lãi đã trừ thuế TNCN', null, 'number'),
                        new FromToSearch('amountExpirDate', 'Số ngày quá hạn', null, 'number'),
                        new DateTimeFromToSearch('expireDate', 'Ngày hoàn trả dự kiến', null, false),
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
                    this._reportTranspayReqService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this.searchPayload = {
                        ...this.searchPayload,
                        ...response.form.value
                    };
                    this._reportTranspayReqService.doSearch(this.searchPayload).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
