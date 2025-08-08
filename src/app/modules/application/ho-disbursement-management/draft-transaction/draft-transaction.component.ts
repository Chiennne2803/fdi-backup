import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {DisbursementTransactionService} from 'app/service';
import {Observable, tap} from 'rxjs';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {MatDialog} from '@angular/material/dialog';
import {CreateRequestComponent} from '../dialogs/create-request/create-request.component';
import {ROUTER_CONST} from 'app/shared/constants';
import {Router} from '@angular/router';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {DateTimeSearch, InputSearch} from 'app/shared/components/group-search/search-config.models';
import {FsCardDownInvestorDTO} from "../../../../models/service/FsCardDownInvestorDTO.model";
import {SignProcessComponent} from "../dialogs/sign-process/sign-process.component";
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";
import {FsCardDownDTO} from "../../../../models/service";
import {
    TABLE_BUTTON_DRAFT_CONFIG,
    TABLE_DRAFT_TRANSACTION_CONFIG,
    TASK_BAR_CONFIG
} from "./disbursement-draft-transaction.config";


@Component({
    selector: 'draft-transaction',
    templateUrl: './draft-transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DraftTransactionComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_DRAFT_TRANSACTION_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_DRAFT_CONFIG;
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
        private _fuseConfirmationService: FuseConfirmationService,
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
        this._disbursementTransactionService.draftTransaction({
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        }).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this._disbursementTransactionService.draftTransaction({
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.createRequest();
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'sign-process':
                this.signManyProcess(event.rowItem as FsCardDownDTO[]);
                break;
            case 'deleted':
                this.deleteMany(event.rowItem);
                break;
            default:
                break;
        }
    }

    public deleteMany(data): void{
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Bạn có chắc chắn muốn xoá dữ liệu này không?',
            message: 'Bạn có chắc chắn muốn xoá dữ liệu này không?',
            actions: {
                confirm: {
                    label: 'Xoá'
                },
                cancel: {
                    label: 'Hủy',
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const requestLock = (data as FsCardDownInvestorDTO[]).map(x => x.fsCardDownId);
                this._disbursementTransactionService.lockAll({ids: requestLock}).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Xoá yêu cầu thành công');
                        this._disbursementTransactionService.draftTransaction(this.searchPayload).subscribe();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
            }
        });
    }

    public signManyProcess(cardDownDTOS: FsCardDownDTO[]): void{
        this._disbursementTransactionService.prepare().subscribe((res) => {
            const dialogRef = this.matDialog.open(SignProcessComponent, {
                disableClose: true,
                width: '50%',
                data: {
                    lstAccountApproval: res.payload.lstAccountApproval,
                    complete: () => {
                        dialogRef.close();
                    },
                },
            });
            dialogRef.componentInstance.onSubmit.subscribe(
                (response) => {
                    this._disbursementTransactionService.doSignProcess({...response,
                        fsCardDownIds: [...cardDownDTOS.map(cardDownDTO => cardDownDTO.fsCardDownId)]}).subscribe((resDisbursement) => {
                        if (resDisbursement.errorCode === '0') {
                            dialogRef.close();
                            this._fuseAlertService.showMessageSuccess('Trình ký thành công');
                            this._disbursementTransactionService.draftTransaction().subscribe();
                        } else {
                            this._fuseAlertService.showMessageError(resDisbursement.message.toString());
                        }
                    });
                }
            );
        });
    }

    public createRequest(): void {
        this._disbursementTransactionService.prepare().subscribe((res) => {
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
                            dialogRef.close();
                            this._disbursementTransactionService.draftTransaction().subscribe();
                            this._fuseAlertService.showMessageSuccess('Lập yêu cầu giải ngân thành công');
                        } else {
                            this._fuseAlertService.showMessageError(resDisbursement.message.toString());
                        }
                    });
                }
            );
        });
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.disbursementManagement.link]);
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
                    this._disbursementTransactionService.draftTransaction({...this.searchPayload}).subscribe();
                } else if (response.action === 'search') {
                    this._disbursementTransactionService.draftTransaction({
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
