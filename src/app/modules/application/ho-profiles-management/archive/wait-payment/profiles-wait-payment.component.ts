import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ProfilesManagementService} from 'app/service';
import {Observable} from 'rxjs';
import {GroupSearchComponent} from '../../../../../shared/components/group-search/group-search.component';
import {TextColumn} from '../../../../../shared/models/datatable/display-column.model';
import {ButtonTableEvent} from '../../../../../shared/models/datatable/table-config.model';
import {
    TABLE_BUTTON_ACTION_CONFIG,
    TABLE_PROFILE_MANAGEMENT_CONFIG,
    TASK_BAR_CONFIG
} from '../../profiles-management.config';
import {
    DropListSearch,
    IDropList,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";

@Component({
    selector: 'profiles-wait-payment',
    templateUrl: './profiles-wait-payment.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProfilesWaitPaymentComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _tableConfig = { ...TABLE_PROFILE_MANAGEMENT_CONFIG, title: 'Hồ sơ chờ tất toán khoản vay', isViewDetail: false };
    public _tableButtonConfig = TABLE_BUTTON_ACTION_CONFIG;
    public _taskbarConfig = TASK_BAR_CONFIG;

    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private listInvestmentTime: IDropList[] = [];
    private lstReasons: IDropList[] = [];
    /**
     * Constructor
     */
    constructor(
        private _profilesManagementService: ProfilesManagementService,
        private matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._profilesManagementService.lazyLoad;
        this._profilesManagementService.setDrawer(this.matDrawer);
        this._profilesManagementService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload.listInvestmentTime != undefined && res.payload.listInvestmentTime.length > 0) {
                this.listInvestmentTime.push({label: 'Tẩt cả', value: null});
                res.payload.listInvestmentTime.forEach(x => this.listInvestmentTime.push({label: x, value: x}));
            }
            if (res.payload.lstReasons != undefined && res.payload.lstReasons.length > 0) {
                this.lstReasons.push({label: 'Tẩt cả', value: null});
                res.payload.lstReasons.forEach(x => this.lstReasons.push({label: x.categoriesName, value: x.admCategoriesId}));
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._profilesManagementService.doSearchLoanProfileWaitingDisbursement(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._profilesManagementService.doSearchLoanProfileWaitingDisbursement(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._profilesManagementService
            .getDetail({ fsLoanProfilesId: row.fsLoanProfilesId })
            .subscribe((res) => {
                this._profilesManagementService.openDetailDrawer();
            });
    }


    handleCloseDetailPanel($event: Event) {
        this._tableConfig.isViewDetail = false;
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
                        new InputSearch('createdByName', 'Người lập', null, false),
                        new InputSearch('fullName', 'Bên huy động vốn', null, false),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn(ngày)', this.listInvestmentTime, null, false),
                        new DropListSearch('reasons', 'Mục đích huy động vốn', this.lstReasons, null, false),
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
                    this._profilesManagementService.doSearchLoanProfileWaitingDisbursement(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._profilesManagementService.doSearchLoanProfileWaitingDisbursement({
                        ...response.form.value,
                        ...this.searchPayload
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
