import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsTranspayInvestorDTO} from 'app/models/service';
import {TranspayInvestorTransactionService} from 'app/service';
import {Observable} from 'rxjs';
import {
    TABLE_BUTTON_CONFIG,
    TABLE_INVESTOR_TRANSPAY_REQ_DRAFT_CONFIG,
    TASK_BAR_TRANSPAY_REQ_DRAFT_CONFIG
} from './draft-trans.config';
import {MatDrawer} from '@angular/material/sidenav';
import {ButtonTableEvent} from '../../../../shared/models/datatable/table-config.model';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {MatDialog} from "@angular/material/dialog";
import {GroupSearchComponent} from "../../../../shared/components/group-search/group-search.component";
import {DropListSearch, InputSearch} from "../../../../shared/components/group-search/search-config.models";
import {FS_TRANSPAY_INVESTOR_STATUS} from "../../../../enum/transpay-investor.enum";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {CommonButtonConfig} from "../../../../shared/models/datatable/task-bar.model";
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";
import {FuseAlertService} from "../../../../../@fuse/components/alert";
import {SignProcessComponent} from "../../ho-disbursement-management/dialogs/sign-process/sign-process.component";


@Component({
    selector: 'app-draft-trans',
    templateUrl: './draft-trans.component.html',
    styleUrls: ['./draft-trans.component.scss'],
    animations: fuseAnimations
})
export class DraftTransComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    dataSource$: Observable<BaseResponse>;
    dataDetail$: Observable<FsTranspayInvestorDTO>;
    tableTransConfig = TABLE_INVESTOR_TRANSPAY_REQ_DRAFT_CONFIG;
    taskBarConfig = TASK_BAR_TRANSPAY_REQ_DRAFT_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_CONFIG;
    public isCreate: boolean = true;
    searchPayload: BaseRequest = {
        page: 0,
        limit: 10,
    };
    private _dataSearchDialog: object;

    constructor(
        private _transpayInvestorService: TranspayInvestorTransactionService,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this._transpayInvestorService.showDetail(false);
        this.dataSource$ = this._transpayInvestorService.lazyLoad;
        this.dataDetail$ = this._transpayInvestorService.transpayInvestor$;
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
        this._transpayInvestorService.getDetail(
            {fsTranspayInvestorId: value.fsTranspayInvestorId}
        ).subscribe((res) => {
            this.isCreate = false;
            this.matDrawer.open();
        });
        this._transpayInvestorService.showDetail(true);
    }

    handleCloseDetailPanel(): void {
        this.matDrawer.close();
        this.reSubscribeData();
        this.tableTransConfig.isViewDetail = false;
        this._transpayInvestorService.showDetail(false);
    }

    onClickAdd(event: ButtonTableEvent): void {
        this._transpayInvestorService.getLoanProfiles().subscribe(res => {
            if (res) {
                this.isCreate = true;
                this.matDrawer.open();
                this._transpayInvestorService.showDetail(true);
            }
        });
    }

    reSubscribeData(): void {
        this._transpayInvestorService.doSearchDraftTransaction(this.searchPayload).subscribe();
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._transpayInvestorService.doSearchDraftTransaction(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.onClickAdd(event);
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            case 'sign-process':
                this._transpayInvestorService.prepare().subscribe((resPrepare) => {
                    const dialogRef = this._dialog.open(SignProcessComponent, {
                        disableClose: true,
                        width: '50%',
                        data: {
                            lstAccountApproval: resPrepare.payload.lstAccountApproval,
                            complete: () => {
                                dialogRef.close();
                            },
                        },
                    });
                    dialogRef.componentInstance.onSubmit.subscribe(
                        (response) => {
                            (event.rowItem as FsTranspayInvestorDTO[]).forEach((fstranspayInv, index) => {
                                setTimeout(()=> {
                                    this._transpayInvestorService.doSignTranspayPay({
                                        ...response,
                                        fsTranspayInvestorId: fstranspayInv.fsTranspayInvestorId
                                    }).subscribe((res) => {
                                        if (res.errorCode === '0') {
                                            this._fuseAlertService.showMessageSuccess('Trình ký thành công');
                                            this._transpayInvestorService.doSearchDraftTransaction().subscribe();
                                        } else {
                                            this._fuseAlertService.showMessageError(res.message.toString());
                                        }
                                        dialogRef.close();
                                    });
                                }, 300 * index);
                            });
                        }
                    );
                });
                break;
            case 'deleted':
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Xác nhận xoá yêu cầu?',
                    message: '',
                    actions: {
                        confirm: {
                            label: 'Đồng ý'
                        },
                        cancel: {
                            label: 'Hủy',
                        }
                    }
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        const requestLock = (event.rowItem as FsTranspayInvestorDTO[]).map(x => x.fsTranspayInvestorId);
                        this._transpayInvestorService.lockAll({ids: requestLock}).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._transpayInvestorService.doSearchDraftTransaction(this.searchPayload).subscribe();
                                this._fuseAlertService.showMessageSuccess('Xoá yêu cầu thành công');
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                        });
                    }
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
                        new InputSearch('lenderName', 'Bên huy động vốn', null, false),
                        new InputSearch('approvalBy', 'Người xử lý', null, false),
                        new InputSearch('transComment', 'Ngội dung xử lý ', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Soạn thảo', value: FS_TRANSPAY_INVESTOR_STATUS.DRAFT},
                            {label: 'Chờ xử lý', value: FS_TRANSPAY_INVESTOR_STATUS.WAITING_PROGRESSING},
                            {label: 'Phê duyệt', value: FS_TRANSPAY_INVESTOR_STATUS.APPROVE},
                            {label: 'Từ chối', value: FS_TRANSPAY_INVESTOR_STATUS.REJECT},
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
                    this._transpayInvestorService.doSearchDraftTransaction({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._transpayInvestorService.doSearchDraftTransaction(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    checkboxItemChange(rows): void {
        const onlyDraft = rows.filter(item => (item.status !== 1)).length == 0;

        let lstCommonBtn: CommonButtonConfig[] = [];
        if (onlyDraft) {
            lstCommonBtn.push({type: 'sign-process', role: 'SFF_TRANSPAY_INVESTOR_TRANSACTION_UPDATE'});
            lstCommonBtn.push({type: 'deleted', role: 'SFF_TRANSPAY_INVESTOR_TRANSACTION_DELETE'});
        }
        this._dataButtonConfig = {
            commonBtn: [
                {
                    type: 'export',
                    role: 'SFF_TRANSPAY_INVESTOR_TRANSACTION_EXPORT',
                    fileName: 'Xu_ly_giao_dich_hoan_tra_dau_tu'
                },
                ...lstCommonBtn,
            ]
        };
    }
}
