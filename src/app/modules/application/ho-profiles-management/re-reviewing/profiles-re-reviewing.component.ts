import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ProfilesManagementService} from 'app/service';
import {Observable} from 'rxjs';
import {
    TABLE_BUTTON_ACTION_CONFIG,
    TABLE_PROFILE_MANAGEMENT_RE_REVIEW,
    TASK_BAR_CONFIG
} from '../profiles-management.config';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {MatDialog} from '@angular/material/dialog';
import {
    DropListSearch,
    FromToSearch,
    IDropList,
    InputSearch
} from "../../../../shared/components/group-search/search-config.models";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'profiles-reviewing',
    templateUrl: './profiles-re-reviewing.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProfilesReReviewingComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _tableConfig = TABLE_PROFILE_MANAGEMENT_RE_REVIEW;
    public _tableButtonConfig = TABLE_BUTTON_ACTION_CONFIG;
    public _taskbarConfig = TASK_BAR_CONFIG;

    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private listInvestmentTime: IDropList[] = [];
    private lstReasons: IDropList[] = [];
    private screenMode: string;
    /**
     * Constructor
     */
    constructor(
        private _profilesManagementService: ProfilesManagementService,
        private matDialog: MatDialog,
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(params => {
            this.screenMode = params['key'];
            this.searchPayload = {
                ...this.searchPayload,
                screenMode: this.screenMode
            }
            this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe(() => {
                this._tableConfig.isViewDetail = false;
                this._profilesManagementService.closeDetailDrawer();
            });
        });
    }

    ngOnInit(): void {
        this._dataSource$ = this._profilesManagementService.lazyLoad;
        this._profilesManagementService.setDrawer(this.matDrawer);
        this._profilesManagementService.getPrepareLoadingPage().subscribe((res) => {
            if (res.payload.listInvestmentTime != undefined && res.payload.listInvestmentTime.length > 0) {
                this.listInvestmentTime.push({label: 'Tẩt cả', value: ''});
                res.payload.listInvestmentTime.forEach(x => this.listInvestmentTime.push({label: x, value: x}));
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
        this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._profilesManagementService
            .getDetail({ fsLoanProfilesId: row.fsLoanProfilesId })
            .subscribe((res) => {
                this._profilesManagementService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event): void {
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
                        new FromToSearch('amount', 'Số tiền cần huy động (VND)', null, 'number'),
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
                    this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._profilesManagementService.doSearchLoanProfileReReview({
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
