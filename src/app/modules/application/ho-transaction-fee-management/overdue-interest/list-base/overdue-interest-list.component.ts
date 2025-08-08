import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    TABLE_BUTTON_ACTION_CONFIG_LIST,
    TABLE_OVERDUE_INTEREST_LIST,
    TASK_BAR_CONFIG,
} from "../overdue-interest.config";
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {DialogService} from 'app/service/common-service/dialog.service';
import {MatDrawer} from '@angular/material/sidenav';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {OverdueInterestDialogComponent} from "./create-dialog/overdue-interest-dialog.component";
import {OverdueInterestService} from "../../../../../service";
import {PageEvent} from "@angular/material/paginator";
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";


@Component({
    selector: 'fee-loan-arrangement',
    templateUrl: './overdue-interest-list.component.html',
    styleUrls: ['./overdue-interest-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OverdueInterestListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_OVERDUE_INTEREST_LIST;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_LIST;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _overdueInterestService: OverdueInterestService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._overdueInterestService.lazyLoad;
        this._overdueInterestService.setDrawer(this.matDrawer);
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'add':
                const dialogConfig = new MatDialogConfig();

                dialogConfig.autoFocus = true;
                dialogConfig.data = event.data;
                dialogConfig.disableClose = true;
                dialogConfig.width = '60%';

                setTimeout(() => {
                    const dialog = this._matDialog.open(OverdueInterestDialogComponent, dialogConfig);
                    dialog.afterClosed().subscribe((res) => {
                        if (res) {
                        }
                    });
                }, 0);
                break;
            default:
                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsLoanProfilesId', 'Hồ sơ huy động vốn', null, false),
                        new InputSearch('admAccountIdPresenterName', 'Khách hàng', null, false),
                        new InputSearch('transactionCode', 'Yêu cầu thanh toán khoản vay', null, false),
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
                    this._overdueInterestService.searchOverdueInterest(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._overdueInterestService.searchOverdueInterest({
                        ...response.form.value,
                        ...this.searchPayload,
                        createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : undefined,
                    }).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: event.pageIndex,
            limit: event.pageSize
        };
        this._overdueInterestService.searchOverdueInterest(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._overdueInterestService.searchOverdueInterest(this.searchPayload).subscribe();
    }
}
