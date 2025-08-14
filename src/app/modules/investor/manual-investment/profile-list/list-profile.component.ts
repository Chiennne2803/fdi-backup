import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {InvestorService} from 'app/service';
import {Observable} from 'rxjs';
import {TABLE_MANUAL_INVESTMENT_CONFIG, TASK_BAR_CONFIG} from '../manual-investment.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {
    DropListSearch,
    FromToSearch,
    IDropList,
    InputSearch
} from '../../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'list-profile',
    templateUrl: './list-profile.component.html',
})

export class ListProfileComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    public _tableManualInvestmentConfig = TABLE_MANUAL_INVESTMENT_CONFIG;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _dataSource$: Observable<BaseResponse>;

    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private lstReasons: IDropList[] = [];
    listInvestmentTime: number[];

    constructor(
        private _investorService: InvestorService,
        private _router: Router,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._investorService.lazyLoad;
        this._investorService.getAllLoanActiveProfile(this.searchPayload).subscribe();
        this._investorService.setDrawer(this.matDrawer);
        this._investorService.getPrepareLoadingPage().subscribe((res: BaseResponse) => {
            if (res.payload) {
                this.listInvestmentTime = res.payload.listInvestmentTime;
                if (res.payload.lstReasons != undefined && res.payload.lstReasons.length > 0) {
                    this.lstReasons.push({label: 'Tẩt cả', value: null});
                    res.payload.lstReasons.forEach(admCategoriesDTO => {
                        this.lstReasons.push({
                            label: admCategoriesDTO.categoriesName,
                            value: admCategoriesDTO.admCategoriesId
                        });
                    })
                }
            }
        });
    }

    ngOnDestroy(): void {
        this._investorService.resetDetailLoanProfile();
        this._investorService.closeDetailDrawer();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._investorService.getAllLoanActiveProfile(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._investorService.getAllLoanActiveProfile(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._investorService
            .getDetailLoanProfile({fsLoanProfilesId: row.fsLoanProfilesId})
            .subscribe((res) => {
                this._investorService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event): void {
        this._tableManualInvestmentConfig.isViewDetail = false;
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
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new InputSearch('createdByName', 'Bên huy động vốn', null, false),
                        new InputSearch('identification', 'Số GPKD', null, false),
                        new FromToSearch('amount', 'Số tiền cần huy động (VNĐ)', null, 'number'),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn(ngày)', this.listInvestmentTime.map(item => ({
                            label: item.toString(),
                            value: item,
                        })), null),
                        new DropListSearch('reasons', 'Mục đích huy động vốn', this.lstReasons, null),
                        new FromToSearch('remainingAmount', 'Số tiền có thể đầu tư (VNĐ)', null, 'number'),
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
                    this._investorService.getAllLoanActiveProfile().subscribe();
                } else if (response.action === 'search') {
                    this._investorService.getAllLoanActiveProfile({
                        ...response.form.value,
                        ...this.searchPayload,
                        // createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : undefined
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
