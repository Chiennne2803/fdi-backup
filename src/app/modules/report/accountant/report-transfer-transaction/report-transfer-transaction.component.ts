import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {
    TABLE_STATISTICAL_REPORT_TRANSFER_TRANSACTION_CONFIG,
    TASK_BAR_STATISTICAL_REPORT_CONFIG
} from './report-transfer-transaction.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch,
    DropListSearch,
    FromToSearch, IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {ReportTransferTransactionService} from "../../../../service/report/accountant/report-transfer-transaction.service";
import {FsInvestorTransP2PDTO} from "../../../../models/service/FsInvestorTransP2PDTO.model";
import {FuseAlertService} from "../../../../../@fuse/components/alert";
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
    selector: 'app-report-transfer-transaction',
    templateUrl: './report-transfer-transaction.component.html',
    styleUrls: ['./report-transfer-transaction.component.scss'],
    animations: fuseAnimations,
})
export class ReportTransferTransactionComponent implements OnInit {
    dataSource$: Observable<BaseResponse>;
    tableConfig = TABLE_STATISTICAL_REPORT_TRANSFER_TRANSACTION_CONFIG;
    taskBarConfig = TASK_BAR_STATISTICAL_REPORT_CONFIG;
    _btnConfig = {
        commonBtn: [
            {type : 'export', role : 'SFF_STATISTIC_EXPORT', fileName : 'Bao_cao_giao_dich_chuyen_nhuong'},
        ],
    };
    @ViewChild('childTemplate', { static: true }) childTemplate: TemplateRef<any>;

    private _dataSearchDialog: object;
    private searchPayload: BaseRequest = new BaseRequest();
    private isFirstLoad = true;
    tableChildDataSource: Map<number, FsInvestorTransP2PDTO[]> = new Map();
    lstProcess: IDropList[] = []
    lstStatus: IDropList[] = []

    constructor(
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _transferTransactionService: ReportTransferTransactionService
    ) { }

    ngOnInit(): void {
        this.tableConfig.title = 'Báo cáo giao dịch chuyển nhượng';
        this._transferTransactionService.getPrepareLoadingPage().subscribe((res) => {
            if(res.payload && res.errorCode === '0') {
                this.lstProcess = this.objectToDropListData(res.payload.lstProcess)
                this.lstStatus = this.objectToDropListData(res.payload.lstStatus)
            }
        })
        this._transferTransactionService.lazyLoad.subscribe((res) => {
            if(!this.isFirstLoad) {
                this.dataSource$ =  this._transferTransactionService.lazyLoad;
            } else {
                this.isFirstLoad = false;
            }
        });

    }

    private objectToDropListData(object: any): IDropList[] {
        // @ts-ignore
        return [{label: 'Tẩt cả', value: -1}].concat(Object.keys(object).map((key) => ({value: key, label: object[key]})));
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._transferTransactionService.doSearch(this.searchPayload).subscribe();
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
        this._transferTransactionService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new InputSearch('companyName', 'Bên huy động', null, false),
                        new InputSearch('investorCode', 'Mã giao dịch đầu tư', null, false),
                        new InputSearch('fullName', 'Bên chuyển nhượng', null, false),
                        new InputSearch('transCode', 'Mã chuyển nhượng', null, false),
                        new DateTimeFromToSearch('createdDate', 'Ngày chuyển nhượng', null, false),
                        new FromToSearch('tranferAmount', 'Số tiền chuyển nhượng', null, 'number'),
                        new FromToSearch('saleAmount', 'Số tiền chào bán', null, 'number'),
                        new FromToSearch('remainTranferAmount', 'Số tiền chuyển nhượng còn lại', null, 'number'),
                        new FromToSearch('remainSalAmount', 'Số tiền rao bán còn lại', null, 'number'),
                        new DropListSearch('status', 'Trạng thái', this.lstStatus, null),
                        new DropListSearch('processResult', 'Kết quả chuyển nhượng', this.lstProcess, null),
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
                    this._transferTransactionService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    const search = {
                        ...this.searchPayload,
                        ...this.safeDropListSearchValue(response.form.value, ['status', 'processResult'])
                    }
                    this._transferTransactionService.doSearch(search).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    private safeDropListSearchValue(obj: any, properties: string[]) {
        for (const el of properties) {
            if (obj[el] && obj[el] === -1) {
                delete obj[el]
            }
        }
        return obj;
    }

    onExpandDetail({action, element}: {action: string, element: any}) {
        if(action === 'open') {
            this._transferTransactionService.getReportDetail({fsReqTransP2PId: element.fsReqTransP2PId}).subscribe((res) => {
                if (res.errorCode === '0') {
                    if (res.payload != undefined && res.payload.length > 0) {
                        this.tableChildDataSource.set(element.fsReqTransP2PId, res.payload);
                    } else {
                        this._fuseAlertService.showMessageWarning('Không có dữ liệu')
                    }

                }
            })
        } else {
            this.tableChildDataSource.delete(element.fsReqTransP2PId);
        }
    }

    getDataSourceChild(element: any) {
        return this.tableChildDataSource.get(element['fsReqTransP2PId']);
    }

}
