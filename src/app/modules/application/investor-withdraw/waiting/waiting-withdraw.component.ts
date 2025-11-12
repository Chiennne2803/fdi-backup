import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {WithdrawCashManagerService} from 'app/service';
import {Observable} from 'rxjs';
import {
    TABLE_BUTTON_ACTION_WAIT_CONFIG,
    TABLE_INVESTOR_WITHDRAW_WAIT_CONFIG,
    TASK_BAR_CONFIG
} from './waiting-withdraw.config';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeSearch,
    DropListSearch,
    IDropList,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {MatDialog} from '@angular/material/dialog';
import {FsTransWithdrawCashDTO} from "../../../../models/service";
import {ConfirmProcessingComponent} from "../../../../shared/components/confirm-processing/confirm-processing.component";
import {FuseAlertService} from "../../../../../@fuse/components/alert";

@Component({
    selector: 'investor-waiting-withdraw',
    templateUrl: './waiting-withdraw.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WaitingWithdrawComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_INVESTOR_WITHDRAW_WAIT_CONFIG;
    public _tableBtnConfig = TABLE_BUTTON_ACTION_WAIT_CONFIG;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private lstBank: IDropList[] = [];
    /**
     * Constructor
     */
    constructor(
        private _withdrawCashManagerService: WithdrawCashManagerService,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._withdrawCashManagerService.waiting$;
        this._dataSource$.subscribe((value) => {
            if (value.content?.length > 0) {
                let sumAmount = 0;
                let sumFee = 0;
                value.content.forEach((x: FsTransWithdrawCashDTO) => {
                    sumAmount = sumAmount + x.amount;
                    sumFee = sumFee + x.fee;
                })
                this._tableConfig.footerTable[0].value = sumAmount;
                this._tableConfig.footerTable[1].value = sumFee;
            }
        });

        this._withdrawCashManagerService.setDrawer(this.detailDrawer);
        this._withdrawCashManagerService.getPrepareLoadingPage().subscribe((res: BaseResponse) => {
            if (res.payload.lstBank != undefined && res.payload.lstBank.length > 0) {
                this.lstBank.push({label: 'Tẩt cả', value: ''});
                res.payload.lstBank.forEach(admCategoriesDTO => {
                    this.lstBank.push({
                        label: admCategoriesDTO.categoriesName,
                        value: admCategoriesDTO.categoriesName
                    });
                })
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._withdrawCashManagerService.doSearchWaitProcessTransaction(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._withdrawCashManagerService.doSearchWaitProcessTransaction(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._withdrawCashManagerService.setDataDetail(row);
        this._withdrawCashManagerService.openDetailDrawer();
    }

    public handleCloseDetailPanel($event: Event): void {
        this._tableConfig.isViewDetail = false;
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'approve':
                this.openDialogApprove(event.rowItem as FsTransWithdrawCashDTO[]);
                break;
            default:
                break;
        }
    }

    private openDialogApprove(withdrawCashDTOS: FsTransWithdrawCashDTO[]): void {
        const dialogRef = this._dialog.open(ConfirmProcessingComponent, {
            // width: '450px',
            data: {
                title: 'Xác nhận nội dung xử lý?',
                valueDefault: 1,
                valueReject: 2,
                choices: [
                    {
                        value: 1,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 2,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                complete: () => {
                    dialogRef.close();
                },
            },
        });

        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                withdrawCashDTOS.forEach(withdrawCashDTO => {
                    this._withdrawCashManagerService.progressingTransaction({...response, fsTransWithdrawCashId: withdrawCashDTO.fsTransWithdrawCashId}).subscribe(
                        (res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess(withdrawCashDTO.transCode + ': Xử lý thành công');
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        }
                    );
                })
                this._withdrawCashManagerService.doSearchWaitProcessTransaction({
                    ...this.searchPayload
                }).subscribe();
                dialogRef.close();
            }
        );
    }
    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã giao dịch', null, false),
                        new InputSearch('amount', 'Số tiền rút (VND)', null, false, 'number'),
                        new InputSearch('accNo', 'Số tài khoản', null, false),
                        new InputSearch('accName', 'Người thụ hưởng', null, false),
                        new DropListSearch('bankName', 'Tên ngân hàng', this.lstBank, null, false),
                        new InputSearch('info', 'Nội dung giao dịch', null, false),
                        new DateTimeSearch( 'createdDate', 'Ngày rút tiền', null, false),
                        // new InputSearch('transComment', 'Nội dung xử lý', null, false),
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
                    this._withdrawCashManagerService.doSearchWaitProcessTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._withdrawCashManagerService.doSearchWaitProcessTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
