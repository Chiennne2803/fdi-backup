import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {InvestorListService} from 'app/service';
import {Observable} from 'rxjs';
import {
    advanceSearch,
    TABLE_BUTTON_ACTION_CONFIG,
    TABLE_INVESTOR_INVESTING_CONFIG,
    TASK_BAR_CONFIG
} from '../investor-profile.config';
import {MatDrawer} from "@angular/material/sidenav";
import {TextColumn} from "../../../../shared/models/datatable/display-column.model";
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {GroupSearchComponent} from '../../../../shared/components/group-search/group-search.component';
import {MatDialog} from '@angular/material/dialog';
import {
    DropListSearch,
    IDropList,
} from "../../../../shared/components/group-search/search-config.models";


@Component({
    selector: 'investor-waiting-profile',
    templateUrl: './waiting-profile.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WaitingProfileComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = { ...TABLE_INVESTOR_INVESTING_CONFIG, title: 'Hồ sơ chờ phê duyệt' , isViewDetail: false};
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private listInvestmentTime: IDropList[] = [];

    /**
     * Constructor
     */
    constructor(
        private _investorListService: InvestorListService,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._investorListService.lazyLoad;
        this._investorListService.setDrawer(this.matDrawer);
        this._investorListService.getPrepareLoadingPage().subscribe((res: BaseResponse) => {
            if (res.payload.listInvestmentTime != undefined && res.payload.listInvestmentTime.length > 0) {
                this.listInvestmentTime.push({label: 'Tẩt cả', value: ''});
                res.payload.listInvestmentTime.forEach(x => this.listInvestmentTime.push({label: x, value: x}));
                let indexToUpdate = advanceSearch.config.findIndex(item => item.id === 'investorTime');
                advanceSearch.config[indexToUpdate] = new DropListSearch('investorTime', 'Kỳ hạn(ngày)', this.listInvestmentTime, null, false);
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._investorListService.waitingApproval(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._investorListService.waitingApproval(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._investorListService
            .getDetail({ fsTransInvestorId: row.fsTransInvestorId })
            .subscribe((res) => {
                this._investorListService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event): void {
        this._tableConfig.isViewDetail = false;
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
                searchConfig:  advanceSearch,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.btnSearchClicked.subscribe(
            (response) => {
                if (response.action === 'reset') {
                    this._investorListService.waitingApproval().subscribe();
                } else if (response.action === 'search') {
                    this._investorListService.waitingApproval({
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
