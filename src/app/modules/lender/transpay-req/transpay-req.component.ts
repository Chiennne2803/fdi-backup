import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTranspayReqDTO} from 'app/models/service';
import {FileService} from 'app/service/common-service';
import {FuseAlertService} from '../../../../@fuse/components/alert';
import {LoanProfilesService, LoanProfilesStoreService} from "../../../service/borrower";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ISelectModel} from "../../../shared/models/select.model";
import {DateTimeformatPipe} from "../../../shared/components/pipe/date-time-format.pipe";
import {AuthService} from "../../../core/auth/auth.service";
import {DialogService} from "../../../service/common-service/dialog.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {fuseAnimations} from "../../../../@fuse/animations";

@Component({
    selector: 'transpay-req',
    templateUrl: './transpay-req.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TranspayReqComponent implements OnInit, OnChanges {

    public payTypes: Array<ISelectModel> = [
        {id: 1, label: 'Thanh toán toàn phần'},
        {id: 2, label: 'Thanh toán 1 phần'},
    ];

    @Input() public fsLoanProfilesDTO: FsLoanProfilesDTO;
    @Input() public fsTranspayReqDTO: FsTranspayReqDTO;
    @Output() public handleCloseDetail: EventEmitter<Event> = new EventEmitter<Event>();
    lstCardDowns: FsCardDownDTO[];
    formGroup: FormGroup = new FormGroup({});
    isSaved: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _loanProfilesService: LoanProfilesService,
        private _loanProfilesStoreService: LoanProfilesStoreService,
        private _fileService: FileService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _dialogService: DialogService,
        private clipboard: Clipboard
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.isSaved = false;
        // this._loanProfilesStoreService.toggle();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.fsLoanProfilesDTO.currentValue) {
            this.fsLoanProfilesDTO = changes.fsLoanProfilesDTO.currentValue;
            if (this.fsTranspayReqDTO == undefined) {
                this.fsTranspayReqDTO = new FsTranspayReqDTO();
            }
            this.fsTranspayReqDTO.fsLoanProfilesId = this.fsLoanProfilesDTO.fsLoanProfilesId;
            this.formGroup.get('fsLoanProfilesId').patchValue(this.fsLoanProfilesDTO.fsLoanProfilesId)
            this._loanProfilesService.getCardDownByLoanProfile(this.fsLoanProfilesDTO.fsLoanProfilesId).subscribe(
                res => {
                    this.lstCardDowns = res.payload.lstCardDowns
                }
            );
        }
        if (changes && changes.fsTranspayReqDTO.currentValue) {
            this.fsTranspayReqDTO = changes.fsTranspayReqDTO.currentValue;
            this.initForm(this.fsTranspayReqDTO);
        }
    }


    private initForm(data?: FsTranspayReqDTO) {
        this.formGroup = this._formBuilder.group({
            fsTranspayReqId: new FormControl(data ? data.fsTranspayReqId : null),
            fsLoanProfilesId: new FormControl(data ? data.fsLoanProfilesId : null, [Validators.required]),
            fsCardDownId: new FormControl(data ? data.fsCardDownId : null, [Validators.required]),
            fsCardDownCode: new FormControl(data ? data.fsCardDownCode : null),
            payType: new FormControl(data ? data.payType : 1, [Validators.required]),
            amountTax: new FormControl(data ? data.amountTax : null),
            paidAmount: new FormControl({
                value: data ? data.paidAmount : null,
                disabled: data?.payType != 2
            }, [Validators.required, Validators.maxLength(15), Validators.min(1)]),
            originalDeduction: new FormControl(0),
            interestDeduction: new FormControl(0),
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
    }

    onClickClose() {
        // this.isCreateRq = false;
        this.handleCloseDetail.emit();
    }

    private initTranspayReq(value: any) {
        this._loanProfilesService.initTranspayReq(this.formGroup.value).subscribe(res => {
            if (res) {
                this.initForm(res.payload);
            }
        });
    }

    get fsTranspayReqId() {
        return this.formGroup.get('fsTranspayReqId').value;
    }

    onChangeSelect(event: any, type: string): void {
        switch (type) {
            case 'loanProfile':
                this._loanProfilesService.getCardDownByLoanProfile(event.value).subscribe(
                    res => this.lstCardDowns = res.payload.lstCardDowns
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


    createTranspayReq(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            confirmDialog.afterClosed().subscribe(
                (res) => {
                    if (res === 'confirmed') {
                        this._loanProfilesService.createTranspayReq(this.formGroup.value).subscribe(
                            (res) => {
                                if (res.errorCode === '0') {
                                    // this.getLoanDetail();
                                    this._fuseAlertService.showMessageSuccess('Tạo yêu cầu thanh toán thành công');
                                    this.isSaved = true;
                                    // this.handleCloseDetail.emit();
                                    this.onClickClose();
                                } else {
                                    this._fuseAlertService.showMessageError(res.message.toString());
                                }
                            }
                        );
                    }
                }
            );
        }
    }


    coppy(text: string | undefined) {
        this.clipboard.copy(text);
        this._fuseAlertService.showMessageSuccess("copied", 500)
    }


}
