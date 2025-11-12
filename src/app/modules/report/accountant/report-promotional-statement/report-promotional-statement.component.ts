import { Component, OnInit } from '@angular/core';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import { Observable } from 'rxjs';

import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { ReportInvestorService } from '../../../../service';
import { PageEvent } from '@angular/material/paginator';
import { TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG, TASK_BAR_STATISTICAL_REPORT_CONFIG } from './report-promotional-statement.config';
import { ReportPromotionalStatementService } from 'app/service/report/accountant/report-promotional-statement.service';

@Component({
    selector: 'app-report-promotional-statement',
    templateUrl: './report-promotional-statement.component.html',
})
export class ReportPromotionalStatementComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Bao_cao_sap_ke_khuyen_mai' },
        ],
    };

    private lstStaff: IDropList[] = [];
    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportPromotionalStatement: ReportPromotionalStatementService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo chương trình khuyến mại';
        // this._reportPromotionalStatement.getPrepareLoadingPage().subscribe(ret => {
        //     if (ret) {
        //         this.lstStaff = [];
        //         this.lstStaff.push({ label: 'Tẩt cả', value: '' });
        //         ret.payload.lstStaff.forEach(el => this.lstStaff.push({
        //             label: el.fullName,
        //             value: el.admAccountDetailId
        //         }));
        //     }
        // });
        this._reportPromotionalStatement.lazyLoad.subscribe((res) => {
            this.dataSource$ = this._reportPromotionalStatement.lazyLoad;
            console.log(this.dataSource$)
        });

    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportPromotionalStatement.doSearch(this.searchPayload).subscribe();
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
        this._reportPromotionalStatement.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                    new DateTimeFromToSearch('createdDate', 'Thời gian giao dịch', null, false, undefined, undefined, 0, true),
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
                    this._reportPromotionalStatement.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportPromotionalStatement.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
