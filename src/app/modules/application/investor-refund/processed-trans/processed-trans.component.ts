import {Component, OnInit, ViewChild} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTranspayInvestorDTO} from 'app/models/service';
import { TranspayInvestorTransactionService } from 'app/service';
import { Observable } from 'rxjs';
import {MatDrawer} from '@angular/material/sidenav';
import {
    TABLE_BUTTON_CONFIG, TABLE_INVESTOR_TRANSPAY_REQ_PROCESS_CONFIG, TASK_BAR_TRANSPAY_REQ_PROCESS_CONFIG,
} from '../processed-trans/processed-trans.config';
import {DialogService} from 'app/service/common-service/dialog.service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {DropListSearch, InputSearch} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
    selector: 'app-processed-trans',
    templateUrl: './processed-trans.component.html',
    styleUrls: ['./processed-trans.component.scss'],
    animations: fuseAnimations
})
export class ProcessedTransComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    dataSource$: Observable<BaseResponse>;
    dataDetail$: Observable<FsTranspayInvestorDTO>;
    tableTransConfig = TABLE_INVESTOR_TRANSPAY_REQ_PROCESS_CONFIG;
    taskBarConfig = TASK_BAR_TRANSPAY_REQ_PROCESS_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_CONFIG;
    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };
    private _dataSearchDialog: object;

    constructor(
        private _investorTransService: TranspayInvestorTransactionService,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this._investorTransService.showDetail(false);
        this.dataSource$ = this._investorTransService.lazyLoad;
        this.dataDetail$ = this._investorTransService.transpayInvestor$;
    }

    handlePageSwitch(event: PageEvent): void {
        this.searchPayload = {
            ...this._dataSearchDialog,
            page: event.pageIndex,
            limit: event.pageSize,
        };
        this.reSubscribeData();
    }

    handleRowClick(value: FsTranspayInvestorDTO): void {
        this._investorTransService.getDetail(
            { fsTranspayInvestorId: value.fsTranspayInvestorId }
        ).subscribe((res) => {
            this.matDrawer.open();
        });
        this._investorTransService.showDetail(true);
    }

    reSubscribeData(): void {
        this._investorTransService.doSearchProcessedTransaction(this.searchPayload).subscribe();
    }

    onClickAdd(event: ButtonTableEvent): void {
       /* const dialogRef = this._dialogService.openMakeRequestInvestorefundDialog();
        dialogRef.afterClosed().subscribe((res) => {
            if ( res && res.success ) {
                this.reSubscribeData();
            }
        });*/
    }

    handleCloseDetailPanel(): void {
        this.matDrawer.close();
        this.reSubscribeData();
        this.tableTransConfig.isViewDetail = false;
        this._investorTransService.showDetail(false);
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._investorTransService.doSearchProcessedTransaction(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.onClickAdd(event);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã giao dịch', null, false),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ huy động vốn', null, false),
                        new InputSearch('admAccountId', 'Bên huy động vốn', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Soạn thảo', value: 1},
                            {label: 'Chờ xử lý', value: 2},
                            {label: 'Phê duyệt', value: 3},
                            {label: 'Từ chối', value: 4},
                        ], null),
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
                    this._investorTransService.doSearchProcessedTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._investorTransService.doSearchProcessedTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
