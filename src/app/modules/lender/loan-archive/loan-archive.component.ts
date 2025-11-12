import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { Observable } from 'rxjs';
import {ButtonTableEvent} from '../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../shared/components/group-search/group-search.component';
import {MatDialog} from '@angular/material/dialog';
import {
    DateTimeSearch,
    DropListSearch, IDropList,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {LoanProfilesStoreService} from "../../../service/borrower";
import {TABLE_BUTTON_ACTION, TABLE_LOAN_CONFIG, TASK_BAR_CONFIG} from "./loan-archive.config";

@Component({
    selector: 'borrower-loan-archive',
    templateUrl: './loan-archive.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoanArchiveComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public _tableLoanConfig = { ...TABLE_LOAN_CONFIG, title: 'Hồ sơ lưu trữ' };
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _btnConfig = TABLE_BUTTON_ACTION;
    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private listInvestmentTime: IDropList[] = [];
    private lstReasons: IDropList[] = [];
    /**
     * Constructor
     */
    constructor(
        private _loanProfilesStoreService: LoanProfilesStoreService,
        private router: Router,
        private matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._loanProfilesStoreService.lazyLoad;
        this._loanProfilesStoreService.setDrawer(this.matDrawer);
        this._loanProfilesStoreService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload.lstLoanTimeCycle != undefined && res.payload.lstLoanTimeCycle.length > 0) {
                this.listInvestmentTime.push({label: 'Tẩt cả', value: ''});
                res.payload.lstLoanTimeCycle.forEach(x => this.listInvestmentTime.push({label: x, value: x}));
            }
            if (res.payload.lstReasons != undefined && res.payload.lstReasons.length > 0) {
                this.lstReasons.push({label: 'Tẩt cả', value: ''});
                res.payload.lstReasons.forEach(x => this.lstReasons.push({label: x.categoriesName, value: x.admCategoriesId}));
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._loanProfilesStoreService.doSearch(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._loanProfilesStoreService.doSearch(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._tableLoanConfig.isViewDetail = false;
        this.router.navigate(['borrower/loan-archive', row.fsLoanProfilesId]);
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
                        new InputSearch('fullName', 'Bên huy động vốn', null, false),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn(ngày)', this.listInvestmentTime, null, false),
                        new InputSearch('amount', 'Số tiền cần huy động', null, false, 'number'),
                        new DropListSearch('reasons', 'Mục đích huy động vốn', this.lstReasons, null, false),
                        new DateTimeSearch('createdDate', 'Ngày lập', null, false),
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
                    this._loanProfilesStoreService.doSearch(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._loanProfilesStoreService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload,
                        // createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : undefined,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
