import {Component, OnInit, ViewChild} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTranspayInvestorDTO} from 'app/models/service';
import { TranspayInvestorTransactionService } from 'app/service';
import { Observable } from 'rxjs';
import {
    TABLE_INVESTOR_TRANSPAY_REQ_WAIT_CONFIG,
    TABLE_BUTTON_CONFIG,
    TASK_BAR_TRANSPAY_REQ_WAIT_CONFIG
} from '../wait-process-trans/wait-process-trans.config';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from "../../../../shared/models/datatable/table-config.model";
import {DialogService} from "../../../../service/common-service/dialog.service";
import {MatDialog} from "@angular/material/dialog";
import {GroupSearchComponent} from "../../../../shared/components/group-search/group-search.component";
import {DropListSearch, InputSearch} from "../../../../shared/components/group-search/search-config.models";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {FsCardDownInvestorDTO} from "../../../../models/service/FsCardDownInvestorDTO.model";
import {
    ConfirmProcessingComponent
} from "../../../../shared/components/confirm-processing/confirm-processing.component";
import {FuseAlertService} from "../../../../../@fuse/components/alert";
import {SignProcessComponent} from "../../ho-disbursement-management/dialogs/sign-process/sign-process.component";


@Component({
    selector: 'app-wait-process-trans',
    templateUrl: './wait-process-trans.component.html',
    styleUrls: ['./wait-process-trans.component.scss'],
    animations: fuseAnimations
})
export class WaitProcessTransComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    dataSource$: Observable<BaseResponse>;
    dataDetail$: Observable<FsTranspayInvestorDTO>;
    tableTransConfig = TABLE_INVESTOR_TRANSPAY_REQ_WAIT_CONFIG;
    taskBarConfig = TASK_BAR_TRANSPAY_REQ_WAIT_CONFIG;
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
        private _alertService: FuseAlertService,
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
        this._investorTransService.doSearchWaitProcessTransaction(this.searchPayload).subscribe();
    }

    onClickAdd(event: ButtonTableEvent): void {
        /*const dialogRef = this._dialogService.openMakeRequestInvestorefundDialog();
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
        this._investorTransService.doSearchWaitProcessTransaction(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.onClickAdd(event);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'approve':
                this._investorTransService.prepare().subscribe((resPrepare) => {
                    const dialogRef = this._dialog.open(ConfirmProcessingComponent, {
                        disableClose: true,
                        width: '50%',
                        data: {
                            title: 'Xác nhận nội dung xử lý?',
                            valueDefault: 3,
                            valueReject: 4,
                            choices: [
                                {
                                    value: 3,
                                    name: 'Phê duyệt',

                                },
                                {
                                    value: 4,
                                    name: 'Từ chối(Ghi rõ lý do)',
                                }
                            ],
                            maxlenNote: 200,
                            complete: () => {
                                dialogRef.close();
                            },
                        },
                    });
                    dialogRef.componentInstance.onSubmit.subscribe(
                        (response) => {
                            (event.rowItem as FsTranspayInvestorDTO[]).forEach((fstranspayInv, index) => {
                                setTimeout(()=> {
                                    this._investorTransService.approvalTranspayInvestor({
                                        ...response,
                                        fsTranspayInvestorId: fstranspayInv.fsTranspayInvestorId
                                    }).subscribe((res) => {
                                        if (res.errorCode === '0') {
                                            this._alertService.showMessageSuccess('Xử lý thành công');
                                            this._investorTransService.doSearchDraftTransaction().subscribe();
                                        } else {
                                            this._alertService.showMessageError(res.message.toString());
                                        }
                                        dialogRef.close();
                                    });
                                }, 300 * index);
                            });
                        }
                    );
                });
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
                            {label: 'Tẩt cả', value: null},
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
                    this._investorTransService.doSearchWaitProcessTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._investorTransService.doSearchWaitProcessTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }


}
