import {Location} from '@angular/common';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {BaseResponse} from 'app/models/base';
import {FsTransactionHistoryDTO} from 'app/models/service';
import {AccountStatementService} from 'app/service';
import {CheckboxColumn, TextColumn} from 'app/shared/models/datatable/display-column.model';
import {Observable} from 'rxjs';
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    IDropList
} from "../../../shared/components/group-search/search-config.models";
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";
import {MatDialog} from "@angular/material/dialog";
import {AdmCategoriesDTO} from "../../../models/admin";
import {TABLE_BUTTON_ACTION_CONFIG_CATEGORY} from "../../admin/category/components/item-list-category/item.config";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'borrower-loan-review',
    templateUrl: './account-statement.component.html',
    styleUrls: ['./account-statement.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountStatementComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    public lstType: IDropList[] = [];
    public totalWithdraw = 0;
    public accountBalance = 0;
    public totalAmountInvesting = 0;
    public totalTopup = 0;

    public fsTransactionHistoryDTO: FsTransactionHistoryDTO;
    public _tableLoanConfig = {
        columnDefinition: [
            new CheckboxColumn(),
            new TextColumn('transDate', 'Thời gian giao dịch', 15, false, 'DD/MM/YYYY HH:mm:ss'),
            new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10, false),
            new TextColumn('transTypeName', 'Loại giao dịch', 25, false),
            new TextColumn('transCode', 'Mã giao dịch', 20, false),
            new TextColumn('amount', 'Số tiền giao dịch(VNĐ)', 15, false, 1),
            new TextColumn('newAmount', 'Số dư(VNĐ)', 15, false, 1),
        ],
        title: 'Sao kê tài khoản', isViewDetail: false,
    };

    public _taskbarConfig = {
        searchBar: {
            placeholder: 'Nhập để tìm kiếm',
            isShowBtnFilter: true,
            btnFilterRole: 'INVESTOR_STATEMENT_SEARCH_STATEMENT'
        }
    };
    public _tableBtnConfig = {
        commonBtn: [
            {type : 'export', role : 'INVESTOR_STATEMENT_EXPORT_STATEMENT', fileName : 'Sao_ke_tai_khoan'},
        ],
    };

    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: FsTransactionHistoryDTO;
    private _dataSearchDialog: object;
    public activeTab = 0;

    /**
     * Constructor
     */
    constructor(
        private _accountStatementService: AccountStatementService,
        private router: Router,
        private location: Location,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._accountStatementService.lazyLoad;
        this._accountStatementService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload) {
                if (res.payload.lstType) {
                    res.payload.lstType.forEach((x: AdmCategoriesDTO) => this.lstType.push({
                        label: x.categoriesName,
                        value: x.admCategoriesId
                    }));
                }
                if (res.payload.totalWithdraw) {
                    this.totalWithdraw = res.payload.totalWithdraw;
                }
                if (res.payload.accountBalance) {
                    this.accountBalance = res.payload.accountBalance;
                }
                if (res.payload.totalAmountInvesting) {
                    this.totalAmountInvesting = res.payload.totalAmountInvesting;
                }
                if (res.payload.totalTopup) {
                    this.totalTopup = res.payload.totalTopup;
                }
            }
        });
    }

    public handleSearch($event: Event): void {
        this._accountStatementService.doSearch(this.searchPayload).subscribe(()=> {
            this._dataSource$ = this._accountStatementService.lazyLoad;
        });
    }

    public handleRowClick(row: any): void {
        this._tableLoanConfig.isViewDetail = false;
        this.router.navigate([this.router.url, row.fsLoanProfilesId]);
    }

    public onBackdropClicked(): void {
        this.location.back();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._accountStatementService.doSearch(this.searchPayload).subscribe();
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
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            disableClose: true,
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new DateTimeFromToSearch('transDate', 'Thời gian giao dịch', null, false),
                        new DropListSearch('transType', 'Loại giao dịch', this.lstType, null, false),
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
                    this._accountStatementService.doSearch().subscribe();
                } else if (response.action === 'search') {
                    this._accountStatementService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload,
                        createdDateFrom: response.form.value.createdDateFrom ? new Date(response.form.value.createdDateFrom).getTime() : undefined,
                        createdDateTo: response.form.value.createdDateTo ? new Date(response.form.value.createdDateTo).getTime() : undefined
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    public onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.activeTab = tabChangeEvent.index
        this.searchPayload = {
            ...this.searchPayload,
            isAuto: this.activeTab === 1
        }
        this.handleSearch(null);
    }
}
