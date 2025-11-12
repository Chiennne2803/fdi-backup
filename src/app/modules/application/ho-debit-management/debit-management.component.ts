import {Location} from '@angular/common';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {ManagementDebtService} from 'app/service';
import {TextColumn} from 'app/shared/models/datatable/display-column.model';
import {Observable} from 'rxjs';
import {TABLE_BUTTON_CONFIG, TABLE_DEBT_MANAGEMENT_CONFIG} from './debt-management.config';
import {PageEvent} from '@angular/material/paginator';
import {FileService} from 'app/service/common-service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    CheckBoxSearch,
    DropListSearch,
    InputSearch
} from '../../../shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {DetailDebitManagementComponent} from './detail-debit-management/detail-debit-management.component';
import {FsReportDebtManagersDTO} from "../../../models/service/FsReportDebtManagersDTO.model";

@Component({
    selector: 'debit-management',
    templateUrl: './debit-management.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DebitManagementComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(DetailDebitManagementComponent) detailComponent: DetailDebitManagementComponent;

    drawerMode: 'side' | 'over';

    public _tableDebtConfig = TABLE_DEBT_MANAGEMENT_CONFIG;
    public _taskbarConfig = {
        searchBar: {
            placeholder: 'Nhập để tìm kiếm',
            isShowBtnFilter: true,
        }
    };
    public _dataButtonConfig= TABLE_BUTTON_CONFIG;

    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest;
    private _dataSearchDialog: object;
    private _dataTenor = [];


    /**
     * Constructor
     */
    constructor(
        private _managementDebtService: ManagementDebtService,
        private router: Router,
        private location: Location,
        private _fileService: FileService,
        private _dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
         this._managementDebtService.lazyLoad.subscribe((res) => {
             this._dataSource$ = this._managementDebtService.lazyLoad;
             this._dataSource$.forEach((resp) => {
                 const listFsReportDebtManagers = resp.content as FsReportDebtManagersDTO[];
                 for (const fsReportDebtManager of listFsReportDebtManagers) {
                     fsReportDebtManager.totalAmountDeb = fsReportDebtManager.totalAmount - fsReportDebtManager.payAmount;
                }
             });
        });
        this._managementDebtService.setDrawer(this.matDrawer);
        this._managementDebtService.prepare().subscribe((res) => {
            res.payload.listInvestmentTime.map((value) => {
                this._dataTenor.push({
                    label: value,
                    value: value
                });
            });
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._managementDebtService.doSearch(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._managementDebtService.doSearch(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._managementDebtService
            .getDetail({fsReportDebtManagersId: row.fsReportDebtManagersId})
            .subscribe((res) => {
                this._managementDebtService.openDetailDrawer();
            });
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

    public onBackdropClicked(): void {
        this.location.back();
    }

    handleCloseDetailPanel($event: Event): void {
        this._tableDebtConfig.isViewDetail = false;
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsLoanProfilesId', 'Hồ sơ huy động vốn', null, false),
                        new InputSearch('fullName', 'Bên huy động vốn', null, false),
                        new DropListSearch('lstLoanTimeCycle', 'Kỳ hạn(ngày)', this._dataTenor, null, true),
                        new DropListSearch('isOverdueDeb', 'Hồ sơ quá hạn', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Có nợ', value: 1},
                            {label: 'Không nợ', value: 2},], null, false),
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
                    this._managementDebtService.doSearch({...this.searchPayload}).subscribe();
                } else if (response.action === 'search') {
                    this._managementDebtService.doSearch({
                        ...response.form.value,
                        ...this.searchPayload,
                        loanTimeCycle: response.form.value.loanTimeCycle ? response.form.value.loanTimeCycle.map(value => value).join(',') : null
                    }).subscribe();
                }
                dialogRef.close();
                this._dataSearchDialog = response.form.value;
            }
        );
    }
}
