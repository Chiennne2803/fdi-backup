import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { ButtonTableEvent } from 'app/shared/models/datatable/table-config.model';
import { Observable } from 'rxjs';
import {FsReqTransP2PService} from 'app/service/admin/req-trans-p2p.service';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DateTimeSearch, DropListSearch,
    FromToSearch,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {TABLE_INVESTOR_SALE_CONFIG, TASK_BAR_CONFIG} from "./sale.config";

@Component({
    selector: 'borrower-loan-review',
    templateUrl: './investment-transfer-sale.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InvestmentTransferSaleComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public _tableTopUpConfig = TABLE_INVESTOR_SALE_CONFIG;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest;
    private _dataSearchDialog: object;
    private _dataTenor = [];
    /**
     * Constructor
     */
    constructor(
        private router: Router,
        private matDialog: MatDialog,
        private _fsReqTransP2PService: FsReqTransP2PService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._fsReqTransP2PService.lazyLoad;
        this._fsReqTransP2PService.setDrawer(this.matDrawer);
        this._fsReqTransP2PService.prepareP2P$.subscribe((res) => {
            if (res) {
                this._dataTenor.push({label: 'Tẩt cả', value: null});
                res.payload.lstTenor.map((value) => {
                    this._dataTenor.push({
                        label: value,
                        value: value
                    });
                });
            }
        });
    }

    public handleSearch($event: Event): void {
        this._fsReqTransP2PService.getListSell({
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        }).subscribe();
    }

    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this.matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new FromToSearch('tranferAmount', 'Số tiền chuyển nhượng (VNĐ)', null, 'number'),
                        new DateTimeFromToSearch( 'investorTimeExpried', 'Ngày đáo hạn', null, false),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn(ngày)', this._dataTenor, null,false),
                        new InputSearch('companyName', 'Bên huy động vốn', null, false),
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
                    this._fsReqTransP2PService.getListSell().subscribe();
                } else if (response.action === 'search') {
                    this._fsReqTransP2PService.getListSell({
                        ...response.form.value,
                        ...this.searchPayload,
                        investorTimeExpriedFrom: response.form.value.investorTimeExpriedFrom ? new Date(response.form.value.investorTimeExpriedFrom).getTime() : null,
                        investorTimeExpriedTo: response.form.value.investorTimeExpriedTo ? new Date(response.form.value.investorTimeExpriedTo).getTime() : null
                    }).subscribe();
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
        this._fsReqTransP2PService.getListSell(this.searchPayload).subscribe();
    }

    public onButtonActionClick(row: any): void {
        this._fsReqTransP2PService
            .getDetail({fsReqTransP2PId: row.fsReqTransP2PId})
            .subscribe((res) => {
                this._fsReqTransP2PService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event) {
        this._tableTopUpConfig.isViewDetail = false;
    }

    public handleRowClick(row: any): void {
        this._fsReqTransP2PService
            .getDetail({fsReqTransP2PId: row.fsReqTransP2PId})
            .subscribe((res) => {
                if (res) {
                    this._fsReqTransP2PService.openDetailDrawer();
                }
            });
    }

}
