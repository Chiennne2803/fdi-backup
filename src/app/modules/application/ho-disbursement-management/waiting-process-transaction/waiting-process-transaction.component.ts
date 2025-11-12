import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {DisbursementTransactionService} from 'app/service';
import {Observable} from 'rxjs';
import {
    TABLE_BUTTON_WAITING_CONFIG,
    TABLE_WAITING_TRANSACTION_CONFIG,
    TASK_BAR_CONFIG
} from './disbursement-waiting-process.config';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
// import {CreateRequestComponent} from '../dialogs/create-request/create-request.component';
import {ROUTER_CONST} from 'app/shared/constants';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {DateTimeSearch, DropListSearch, InputSearch} from 'app/shared/components/group-search/search-config.models';
import {FsCardDownInvestorDTO} from "../../../../models/service/FsCardDownInvestorDTO.model";
import {ConfirmProcessingComponent} from "../../../../shared/components/confirm-processing/confirm-processing.component";
import {FsCardDownDTO} from "../../../../models/service";


@Component({
    selector: 'waiting-process-transaction',
    templateUrl: './waiting-process-transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WaitingProcessTransactionComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_WAITING_TRANSACTION_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_WAITING_CONFIG;
    private searchPayload: BaseRequest;
    private _dataSearchDialog: object;
    private _lstAccountApproval = [];
    /**
     * Constructor
     */
    constructor(
        private _disbursementTransactionService: DisbursementTransactionService,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _dialog: MatDialog,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._disbursementTransactionService.lazyLoad;
        this._dataSource$.subscribe((value) => {
            if(value.content?.length > 0) {
                let sum = 0;
                value.content.forEach((x: FsCardDownDTO) => {
                    sum = sum + x.amount;
                })
                // @ts-ignore
                this._tableConfig.footerTable[0].value = sum;
            }
        });
        this._disbursementTransactionService.setDrawer(this.matDrawer);
        this._disbursementTransactionService.prepare().subscribe((res) => {
            res.payload.lstAccountApproval.map((value) => {
                this._lstAccountApproval.push({
                    label: value.fullName,
                    value: value.admAccountDetailId,
                });
            });
        });
    }

    public handleSearch($event: Event): void {
        this._disbursementTransactionService.waitProcessTransaction({
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        }).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this._disbursementTransactionService.waitProcessTransaction({
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    public handleRowClick(row: any): void {
        this._disbursementTransactionService
            .getDetail({fsCardDownId: row.fsCardDownId})
            .subscribe((res) => {
                this._disbursementTransactionService.openDetailDrawer();
            });
    }

    handleCloseDetailPanel($event: Event) {
        this._tableConfig.isViewDetail = false;
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.createRequest();
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'approve':
                this.approveMany(event.rowItem as FsCardDownInvestorDTO[]);
                break;
            default:
                break;
        }
    }

    public approveMany(investors: FsCardDownInvestorDTO[]): void{
        const dialogRef = this.matDialog.open(ConfirmProcessingComponent, {
            disableClose: true,
            // width: '50%',
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
                complete: () => {
                    dialogRef.close();
                },
            },
        });

        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                this._disbursementTransactionService.approvalCardDown({...response, fsCardDownIds: [...investors.map(investor => investor.fsCardDownId)]}).subscribe(
                    (res) => {
                        if (res.errorCode === '0') {
                            dialogRef.close();
                            this._disbursementTransactionService.waitProcessTransaction().subscribe();
                            this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                            this.back();
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    }
                );
            }
        );
    }

    public createRequest(): void {
        /*this._disbursementTransactionService.prepare().subscribe((res) => {
            const dialogRef = this.matDialog.open(CreateRequestComponent, {
                width: '50%',
                data: {
                    loanProfiles: res.payload.loanProfiles,
                    complete: () => {
                        dialogRef.close();
                    },
                },
            });
            dialogRef.componentInstance.onSubmit.subscribe(
                (response) => {
                    this._disbursementTransactionService.createDisbursementRequest(response).subscribe((resDisbursement) => {
                        if (resDisbursement.errorCode === '0') {
                            this._disbursementTransactionService.draftTransaction().subscribe();
                            this._fuseAlertService.showMessageSuccess('Lập yêu cầu giải ngân thành công');
                        } else {
                            this._fuseAlertService.showMessageError(resDisbursement.message.toString());
                        }
                    });
                }
            );
        });*/
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.disbursementManagement.waiting.link]);
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
                        new InputSearch('amount', 'Số tiền giải ngân', null, false, 'number'),
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ huy động vốn', null, false),
                        new InputSearch('createdByName', 'Người lập', null, false),
                        new DateTimeSearch('createdDate','Ngày lập',null,false),
                        new DropListSearch('approvalBy', 'Người xử lý', this._lstAccountApproval, null,false),
                        new DateTimeSearch('approvalDate','Ngày xử lý',null,false),
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
                    this._disbursementTransactionService.waitProcessTransaction({...this.searchPayload}).subscribe();
                } else if (response.action === 'search') {
                    this._disbursementTransactionService.waitProcessTransaction({
                        ...response.form.value,
                        ...this.searchPayload,
                        amount: response.form.value.amount ? Number(response.form.value.amount) : null,
                        createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : null,
                        processDate: response.form.value.processDate ? new Date(response.form.value.processDate).getTime() : null,
                    }).subscribe();
                }
                dialogRef.close();
                this._dataSearchDialog = response.form.value;
            }
        );
    }
}
