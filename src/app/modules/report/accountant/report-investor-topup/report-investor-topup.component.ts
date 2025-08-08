import { Component, OnInit } from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-investor-topup.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    FromToSearch,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {ReportTopupRequestService} from '../../../../service';
import {PageEvent} from '@angular/material/paginator';
import { FsTopupDTO} from "../../../../models/service";

@Component({
  selector: 'app-report-investor-topup',
  templateUrl: './report-investor-topup.component.html',
  styleUrls: ['./report-investor-topup.component.scss']
})
export class ReportInvestorTopupComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            {type : 'export', role : 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_nap_tien'},
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private isFirst = true;

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportTopupRequestService: ReportTopupRequestService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo nạp tiền của nhà đầu tư';
        this._reportTopupRequestService.lazyLoad.subscribe((res) => {
            if(!this.isFirst) {
                this.dataSource$ =  this._reportTopupRequestService.lazyLoad;
            } else {
                this.isFirst = false;
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportTopupRequestService.doSearch(this.searchPayload).subscribe();


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
        this._reportTopupRequestService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('admAccountIdReciveName', 'Tên khách hàng', null, false),
                        new InputSearch('admAccountIdRecive', 'ID khách hàng', null, false),
                        new DateTimeFromToSearch( 'lastUpdatedDate', 'Ngày nạp tiền', null, false, undefined, undefined,0,true),
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
                    this._reportTopupRequestService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportTopupRequestService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
