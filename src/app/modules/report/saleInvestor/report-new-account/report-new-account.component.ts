import {Component, OnInit} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {DialogService} from 'app/service/common-service/dialog.service';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-new-account.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {ReportNewAccountService} from '../../../../service';
import {PageEvent} from '@angular/material/paginator';
import {AdmAccountDetailDTO} from "../../../../models/admin";

@Component({
    selector: 'app-report-investor-topup',
    templateUrl: './report-new-account.component.html',
    styleUrls: ['./report-new-account.component.scss']
})
export class ReportNewAccountComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    private lstStaff: IDropList[] = [];
    _btnConfig = {
        commonBtn: [
            {type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_tai_khoan_mo_moi'},
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();

    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportNewAccountService: ReportNewAccountService
    ) {
    }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo tài khoản mới';
        this._reportNewAccountService.lazyLoad.subscribe((res) => {
                this.dataSource$ =  this._reportNewAccountService.lazyLoad;
        });
        this._reportNewAccountService.getPrepareLoadingPage().subscribe(ret => {
            if (ret) {
                this.lstStaff = [];
                this.lstStaff.push({label: 'Tẩt cả', value: ''});
                ret.payload.lstStaff.forEach(el => this.lstStaff.push({
                    label: el.fullName,
                    value: el.fullName
                }));
            }
        })
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportNewAccountService.doSearch(this.searchPayload).subscribe();
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
        this._reportNewAccountService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fullName', 'Tên khách hàng', null, false),
                        new InputSearch('admAccountId', 'ID khách hàng', null, false),
                        new DateTimeFromToSearch('lastUpdatedDate', 'Thời gian mở', null, false, undefined, undefined,0 ,true ),
                        new FromToSearch('amount', 'Nạp tiền', null, 'number'),
                        new DropListSearch('manageStaffName', 'Nhân viên quản lý', this.lstStaff, null, false),
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
                    this._reportNewAccountService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportNewAccountService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
