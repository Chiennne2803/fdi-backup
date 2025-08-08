import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';

import {BaseRequest, BaseResponse} from 'app/models/base';
import {ButtonTableEvent} from '../../../../../shared/models/datatable/table-config.model';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {LoanArrangementFeeService} from '../../../../../service';
import {MatDrawer} from '@angular/material/sidenav';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FeeLoanArrangementDialogComponent} from "./create-dialog/fee-loan-arrangement-dialog.component";
import {PageEvent} from "@angular/material/paginator";
import {GroupSearchComponent} from "../../../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    InputSearch
} from "../../../../../shared/components/group-search/search-config.models";
import {
    TASK_BAR_CONFIG,
    TABLE_BUTTON_ACTION_CONFIG_LIST,
    TABLE_FEE_LOAN_ARRANGEMENT_LIST
} from "../fee-loan-arrangement.config";


@Component({
    selector: 'fee-loan-arrangement',
    templateUrl: './fee-loan-arrangement-list.component.html',
    styleUrls: ['./fee-loan-arrangement-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeeLoanArrangementListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_FEE_LOAN_ARRANGEMENT_LIST;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_CONFIG_LIST;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _loanArrangementFeeService: LoanArrangementFeeService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._loanArrangementFeeService.lazyLoad;
        this._loanArrangementFeeService.setDrawer(this.matDrawer);
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
                    const dialog = this._matDialog.open(FeeLoanArrangementDialogComponent, dialogConfig);
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
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new DateTimeFromToSearch('transDate', 'Ngày giải ngân', null, false),
                        new InputSearch('admAccountIdPresenterName', 'Khách hàng', null, false),
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
                    this._loanArrangementFeeService.searchLoanArrangementFee(this.searchPayload).subscribe();
                } else if (response.action === 'search') {
                    this._loanArrangementFeeService.searchLoanArrangementFee({
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
        this._loanArrangementFeeService.searchLoanArrangementFee(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._loanArrangementFeeService.searchLoanArrangementFee(this.searchPayload).subscribe();
    }
}
