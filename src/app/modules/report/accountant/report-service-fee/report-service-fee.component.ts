import { Component, OnInit } from '@angular/core';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { DialogService } from 'app/service/common-service/dialog.service';
import { Observable } from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-service-fee.config';
import { ButtonTableEvent } from '../../../../shared/models/datatable/table-config.model';
import { GroupSearchComponent } from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import { MatDialog } from '@angular/material/dialog';
import { ReportServiceFeeService, ReportTopupRequestService } from '../../../../service';
import { PageEvent } from '@angular/material/paginator';
import { FsCardDownDTO, FsLoanProfilesDTO, FsTopupDTO } from "../../../../models/service";
import { TextColumn } from "../../../../shared/models/datatable/display-column.model";

@Component({
    selector: 'app-report-investor-topup',
    templateUrl: './report-service-fee.component.html',
    styleUrls: ['./report-service-fee.component.scss']
})
export class ReportServiceFeeComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_INVESTOR_TOPUP_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            { type: 'export', role: 'SFF_STATISTIC_EXPORT', fileName: 'Bao_cao_thu_phi_dich_vu_ket_noi_thanh_cong' },
        ],
    };

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private lstStaff: IDropList[] = [];
    private lstTenor: IDropList[] = [];


    constructor(
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _reportServiceFeeService: ReportServiceFeeService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo thu phí dịch vụ kết nối thành công';
        this._reportServiceFeeService.lazyLoad.subscribe((res) => {
            this.dataSource$ = this._reportServiceFeeService.lazyLoad;
        });
        this._reportServiceFeeService.getPrepareLoadingPage().subscribe(ret => {
            if (ret) {
                this.lstStaff = [];
                this.lstTenor = [];
                this.lstStaff.push({ label: 'Tẩt cả', value: '' });
                ret.payload.lstStaff.forEach(el => this.lstStaff.push({
                    label: el.fullName,
                    value: el.fullName
                }));
                this.lstTenor.push({ label: 'Tẩt cả', value: '' });
                ret.payload.lstTenor.forEach(el => this.lstTenor.push({
                    label: el,
                    value: el
                }));
            }
        })
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._reportServiceFeeService.doSearch(this.searchPayload).subscribe();
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
        this._reportServiceFeeService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new DateTimeFromToSearch('loanTimeStart', 'Thời gian bắt đầu huy động', null, false, undefined, undefined),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new InputSearch('fullName', 'Bên huy động vốn', null, false),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn', this.lstTenor, null),
                        new FromToSearch('amount', 'Số tiền', null, 'number'),
                        new DropListSearch('manageStaffName', 'Nhân viên phụ trách', this.lstStaff, null),
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
                    this._reportServiceFeeService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._reportServiceFeeService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
