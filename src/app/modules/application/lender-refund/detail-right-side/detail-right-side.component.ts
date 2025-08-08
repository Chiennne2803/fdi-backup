import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTranspayReqDTO} from '../../../../models/service';
import {TranspayReqTransactionService} from '../../../../service';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ISelectModel} from "../../../../shared/models/select.model";
import {AuthService} from "../../../../core/auth/auth.service";
import {DateTimeformatPipe} from "../../../../shared/components/pipe/date-time-format.pipe";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, Observable, startWith} from "rxjs";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
    selector: 'app-detail-right-side',
    templateUrl: './detail-right-side.component.html',
    styleUrls: ['./detail-right-side.component.scss'],
    providers: [DateTimeformatPipe],
    animations: fuseAnimations
})
export class DetailRightSideComponent implements OnInit, OnChanges {
    @Input() isDetailErrorScreen: boolean = false;
    @Input() isConfirmScreen: boolean = false;
    @Input() isCreateRq: boolean = false;
    @Output() handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    isPrepareSave: boolean = false;

    formGroup: FormGroup = new FormGroup({});

    public lstLoanProfileFilter = new Observable<FsLoanProfilesDTO[]>();
    lstLoanProfileALL: FsLoanProfilesDTO[];
    lstCardDowns: FsCardDownDTO[];
    fsTranspayReqDTO: FsTranspayReqDTO;
    fsTranspayReqDTO_OLD: FsTranspayReqDTO;
    // initName: string;

    public payTypes: Array<ISelectModel> = [
        {id: 1, label: 'Thanh toán toàn phần'},
        {id: 2, label: 'Thanh toán 1 phần'},
    ];

    constructor(
        private _transpayReqService: TranspayReqTransactionService,
        private _dialogService: DialogService,
        private _alertService: FuseAlertService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _fuseAlertService: FuseAlertService,
        private clipboard: Clipboard
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this._transpayReqService.transPayReqDetail$.subscribe(res => {
            if (res) {
                this.fsTranspayReqDTO = res;
                this.initForm(res);
            } else {
                this.fsTranspayReqDTO = null;
            }
        });
        this._transpayReqService.loanProfiles$.subscribe(res => {
            if (res) {
                this.lstLoanProfileALL = res;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isCreateRq) {
            this.initForm();
        }
    }

    onChangeSelect(event: any, type: string): void {
        switch (type) {
            case 'loanProfile':
                this._transpayReqService.getCardDownByLoanProfile(event.value).subscribe(
                    res => {
                        this.lstCardDowns = res.payload.lstCardDowns;
                        // this.initName = res.payload.nameLoanProfiles;
                        // this.formGroup.get('nameLoanProfiles').patchValue(this.initName);
                    }
                );
                break;
            case 'cardDown':
                if (!this.formGroup.get('payType').value) {
                    this.formGroup.get('payType').patchValue(1);
                }
                this.initTranspayReq(this.formGroup.value);
                break;
            case 'payType':
                this.initTranspayReq(this.formGroup.value);
                break;
            case 'amount':
                this.initTranspayReq(this.formGroup.value);
                break;
            default:
        }
    }

    onClickClose(): void {
        this.initForm();
        this.handleCloseDetailPanel.emit();
    }

    cancelSave(): void {
        this.isPrepareSave = false;
        this.fsTranspayReqDTO = this.fsTranspayReqDTO_OLD;
        this.initForm();
    }

    onClickProcess(): void {
        if (this.isDetailErrorScreen) {
            const processDialog = this._dialogService.openProcessDialog({
                transPayReq: this.fsTranspayReqDTO
            });
            processDialog.afterClosed().subscribe((res) => {
                if (res) {
                    if (res.transPayReq) {
                        this.isPrepareSave = true;
                        if (this.fsTranspayReqDTO?.topupMailTransferDTO?.status == 3) {
                            //loi ko xac dinh so tien
                            this.fsTranspayReqDTO.topupMailTransferDTO.amount = res.transPayReq.paidAmount;
                        } else if (this.fsTranspayReqDTO?.topupMailTransferDTO?.status == 2
                            || this.fsTranspayReqDTO?.topupMailTransferDTO?.status == 6) {
                            //loi ko xac dinh nguoi thu huong
                            this.fsTranspayReqDTO_OLD = this.fsTranspayReqDTO;
                            this.fsTranspayReqDTO = res.transPayReq;
                            this.fsTranspayReqDTO.topupMailTransferDTO = this.fsTranspayReqDTO_OLD.topupMailTransferDTO;
                            this.initForm(this.fsTranspayReqDTO);
                        }
                    }
                }
            });
        } else if (this.isConfirmScreen) {
            this.openConfirmProcessingDialog();
        }


        // else {
        /*if ( this.dataSource?.transpayReq?.paidAmount < this.dataSource?.transpayReq?.amount ) {
            const cfDialog = this._dialogService.openConfirmDialog(
                'Số tiền đã thanh toán nhỏ hơn tổng tiền hoàn trả.' +
                'Hãy liên hệ với người vay vốn, để yêu cầu hoàn thành thanh toán khoản vay'
            );
            cfDialog.afterClosed().subscribe(
                (res) => {
                    if ( res === 'confirmed' ) {
                        this.openConfirmProcessingDialog();
                    }
                }
            );
        } else {
            this.openConfirmProcessingDialog();
        }*/
        // }
    }

    openConfirmProcessingDialog(): void {
        const dialogRef = this._dialogService.openConfirmProcessingDialog(4, 5);
        dialogRef.componentInstance.onSubmit.subscribe((res) => {
            if (res) {
                const payload = {
                    fsTranspayReqId: this.fsTranspayReqDTO.fsTranspayReqId,
                    status: res.status,
                    approvalComment: res.approvalComment
                };
                this._transpayReqService.approvalApprovalTranspayReq(payload).subscribe(
                    (response) => {
                        if (response.errorCode === '0') {
                            this._alertService.showMessageSuccess('Xử lý thành công');
                            this._transpayReqService.getDetail({fsTranspayReqId: this.fsTranspayReqDTO.fsTranspayReqId}).subscribe();
                            dialogRef.close();
                        } else {
                            this._alertService.showMessageError(response.message.toString());
                        }
                    }
                );
            }
        });
    }

    onClickSave(): void {
        const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
        confirmDialog.afterClosed().subscribe(
            (res) => {
                if (res === 'confirmed') {
                    this._transpayReqService.progressingTranspayReqError(this.fsTranspayReqDTO).subscribe(
                        (res) => {
                            if (res.errorCode === '0') {
                                this._alertService.showMessageSuccess('Xử lý thành công');
                            } else {
                                this._alertService.showMessageError(res.message.toString());
                            }
                            this.onClickClose();
                        }
                    );
                }
            }
        );
    }

    createTranspayReq(): void {
        const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
        confirmDialog.afterClosed().subscribe(
            (res) => {
                if (res === 'confirmed') {
                    this._transpayReqService.create(this.formGroup.value).subscribe(
                        (res) => {
                            if (res.errorCode === '0') {
                                this._transpayReqService.doSearchWaitPayTransaction();
                                this._alertService.showMessageSuccess('Tạo yêu cầu thanh toán thành công');
                                this.onClickClose();
                            } else {
                                this._alertService.showMessageError(res.message.toString());
                            }
                        }
                    );
                }
            }
        );
    }

    get fsTranspayReqId() {
        return this.formGroup.get('fsTranspayReqId').value;
    }

    private initForm(data?: FsTranspayReqDTO) {
        this.formGroup = this._formBuilder.group({
            fsTranspayReqId: new FormControl(data ? data.fsTranspayReqId : null, [Validators.required]),
            fsLoanProfilesId: new FormControl(data ? data.fsLoanProfilesId : null, [Validators.required]),
            fsCardDownId: new FormControl(data ? data.fsCardDownId : null, [Validators.required]),
            fsCardDownCode: new FormControl(data ? data.fsCardDownCode : null),
            payType: new FormControl(data ? data.payType : 1, [Validators.required]),
            amountTax: new FormControl(data ? data.amountTax : null),
            paidAmount: new FormControl({
                value: data ? data.paidAmount : null,
                disabled: data?.payType != 2
            }, [Validators.required, Validators.maxLength(15), Validators.min(0)]),
            originalDeduction: new FormControl(data ? data.originalDeduction : null,
                [Validators.maxLength(15), Validators.min(0)]),
            interestDeduction: new FormControl(data ? data.interestDeduction : null,
                [Validators.maxLength(15), Validators.min(0)]),
            principalBalancePeriod: new FormControl(data ? data.principalBalancePeriod : null),
            interestBalancePeriod: new FormControl(data ? data.interestBalancePeriod : null),
            principalPaidPeriod: new FormControl(data ? data.principalPaidPeriod : null),
            interestPaidPeriod: new FormControl(data ? data.interestPaidPeriod : null),
            principalAmountDue: new FormControl(data ? data.principalAmountDue : null),
            interestAmountDue: new FormControl(data ? data.interestAmountDue : null),
            overdueInterestOnPrincipal: new FormControl(data ? data.overdueInterestOnPrincipal : null),
            overdueInterestOnInterest: new FormControl(data ? data.overdueInterestOnInterest : null),
            principalBalanceEndPeriod: new FormControl(data ? data.principalBalanceEndPeriod : null),
            interestBalanceEndPeriod: new FormControl(data ? data.interestBalanceEndPeriod : null),
            paidBankAmount: new FormControl(data ? data.paidBankAmount : null),
            expirDate: new FormControl(data ? new Date(data.expirDate) : null),
            paidDate: new FormControl(data ? new Date(data.paidDate) : null),
            accNo: new FormControl(data ? data.accNo : null),
            accName: new FormControl(data ? data.accName : null),
            bankName: new FormControl(data ? data.bankName : null),
            branchName: new FormControl(data ? data.branchName : null),
            bankDescription: new FormControl(data ? data.bankDescription : null),
            status: new FormControl(data ? data.status : null, [Validators.required]),
            transCode: new FormControl(data ? data.transCode : null, [Validators.required]),
            // nameLoanProfiles: new FormControl( null),
            admAccountName: new FormControl(data ? data.admAccountName : null),
            loanTimeCycle: new FormControl(data ? data.loanTimeCycle : null),
            rate: new FormControl(data ? data.rate : null),
            createdByName: new FormControl({
                value: data ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });

        this.lstLoanProfileFilter = this.formGroup.controls.fsLoanProfilesId.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterCode(state) : this.lstLoanProfileALL.slice()))
        );

        /* this.formGroup.get('paidAmount').valueChanges.subscribe(value => {
             if(value) {
                 this.formGroup.get('paidAmount').patchValue(value);
                 this.initTranspayReq(this.formGroup.value)
             }
         });
         this.formGroup.get('originalDeduction').valueChanges.subscribe(value => {
             if(value) {
                 this.formGroup.get('originalDeduction').patchValue(value);
                 this.initTranspayReq(this.formGroup.value)
             }
         });
         this.formGroup.get('interestDeduction').valueChanges.subscribe(value => {
             if(value) {
                 this.formGroup.get('interestDeduction').patchValue(value);
                 this.initTranspayReq(this.formGroup.value)
             }
         });*/
    }

    private initTranspayReq(value: any) {
        this._transpayReqService.initTranspayReq(this.formGroup.value).subscribe(res => {
            if (res.errorCode === '0') {
                this.initForm(res.payload);
                // this.formGroup.get('nameLoanProfiles').patchValue(this.initName);
            } else {
                this._fuseAlertService.showMessageError(res.message.toString());
            }
        });
    }

    private _filterCode(value: string): FsLoanProfilesDTO[] {
        const filterValue = String(value).toLowerCase();
        return this.lstLoanProfileALL.filter(state => state.fsLoanProfilesId.toString().toLowerCase().includes(filterValue));
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent, type?: string): void {
        this.initForm();
        const value = this.lstLoanProfileALL.filter(el => el.fsLoanProfilesId === event.option.value);
        if (value.length === 1) {
            this.formGroup.controls.fsLoanProfilesId.setValue(value[0].fsLoanProfilesId.toString());
            this.onChangeSelect({value: value[0].fsLoanProfilesId}, type);
        }
    }

    coppy(text: string | undefined) {
        this.clipboard.copy(text);
        this._fuseAlertService.showMessageSuccess("copied", 500)
    }

    isTimeOutTrans(): boolean {
        return window.location.pathname.endsWith('/timeout-trans');
    }

    onCancelRequest(): void {
        const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận hủy yêu cầu thanh toán');
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this._transpayReqService.cancelRequest({
                    ids: [this.fsTranspayReqId],
                }).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Hủy thành công');
                        this.handleCloseDetailPanel.emit();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
            }
        });
    }
}
