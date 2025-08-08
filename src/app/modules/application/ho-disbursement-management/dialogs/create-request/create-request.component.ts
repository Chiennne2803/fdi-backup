import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTransInvestorDTO} from '../../../../../models/service';
import {FuseConfirmationConfig, FuseConfirmationService} from '../../../../../../@fuse/services/confirmation';
import {AuthService} from 'app/core/auth/auth.service';
import {DisbursementTransactionService} from 'app/service';
import {DateTimeformatPipe} from "../../../../../shared/components/pipe/date-time-format.pipe";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";

@Component({
    selector: 'confirm-debt',
    templateUrl: './create-request.component.html',
    styleUrls: ['create-request.component.css'],
    providers: [DateTimeformatPipe]
})
export class CreateRequestComponent implements OnInit {
    onSubmit = new EventEmitter();
    public createRequest: FormGroup = new FormGroup({});
    public selectedTransInvestors: FsTransInvestorDTO[] = [];

    public investors: FsTransInvestorDTO[];
    public lstInvestorTimeStart: number[];
    public totalAmount: number = 0;
    public totalInteres: number = 0;
    public totalFee: number = 0;
    public totalAmountRecive: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            payload: object;
            loanProfiles: FsLoanProfilesDTO[];
            complete: () => void;
        },
        public authService: AuthService,
        private _formBuilder: FormBuilder,
        private _confirmService: FuseConfirmationService,
        private _disbursementTransactionService: DisbursementTransactionService,
        private _datetimePipe: DateTimeformatPipe,
        private _fuseAlertService: FuseAlertService,
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        this.createRequest = this._formBuilder.group({
            fsLoanProfilesId: new FormControl(null, Validators.required),
            transCode: new FormControl(null, Validators.required),
            fee: new FormControl(null),
            feeRate: new FormControl(null),
            accNo: new FormControl(null),
            accName: new FormControl(null),
            bankName: new FormControl(null),
            branchName: new FormControl(null),

            //ext item
            listTransInvestorId: new FormControl('', [Validators.required]),
            selectTransInvestors: new FormControl('', [Validators.required]),
            investorTimeStart: new FormControl(null, [Validators.required]),

            fullName: new FormControl(null, Validators.required),
            loanTimeCycle: new FormControl(null, Validators.required),
            mobilizedAmount: new FormControl(null, Validators.required),
        });

    }

    public onSelectLoanProfile(profileId): void {
        if (profileId) {
            this._disbursementTransactionService.getInvestorTimeStart({fsLoanProfilesId: profileId}).subscribe((res) => {
                if (res && res.errorCode === '0') {
                    this.lstInvestorTimeStart = res.payload.lstInvestorTimeStart;
                    let fsCardDown: FsCardDownDTO = res.payload.fsCardDown;
                    let fsLoanProfiles: FsLoanProfilesDTO = res.payload.fsLoanProfiles;
                    this.createRequest.get("transCode").patchValue(fsCardDown.transCode)
                    this.createRequest.get("accNo").patchValue(fsCardDown.accNo)
                    this.createRequest.get("accName").patchValue(fsCardDown.accName)
                    this.createRequest.get("bankName").patchValue(fsCardDown.bankName)
                    this.createRequest.get("branchName").patchValue(fsCardDown.branchName)
                    this.createRequest.get("fee").patchValue(fsCardDown.fee)
                    this.createRequest.get("feeRate").patchValue(fsCardDown.feeRate)
                    this.createRequest.get("fullName").patchValue(fsLoanProfiles.admAccountName)
                    this.createRequest.get("loanTimeCycle").patchValue(fsLoanProfiles.loanTimeCycle)
                    this.createRequest.get("mobilizedAmount").patchValue(fsLoanProfiles.amount - fsLoanProfiles.remainingAmount)
                } else {
                    this._fuseAlertService.showMessageError(res.message.toString());
                    this.createRequest.get("fsLoanProfilesId").patchValue('')
                    this.createRequest.get("investorTimeStart").patchValue('')
                    this.createRequest.get("selectTransInvestors").patchValue('')
                }
                this.investors = [];
                this.selectedTransInvestors = [];
            });
        }
    }


    public onSelectInvestorTimeStart(investorTimeStart): void {
        if (investorTimeStart && this.createRequest.get('fsLoanProfilesId').value) {
            this._disbursementTransactionService.getTransInvestor({
                investorTimeStart: new Date(investorTimeStart),
                fsLoanProfilesId: this.createRequest.get('fsLoanProfilesId').value
            }).subscribe((res) => {
                if (res && res.errorCode === '0') {
                    this.investors = res.payload.investors;
                } else {
                    this._fuseAlertService.showMessageError(res.message.toString());
                }
            });
        }
    }

    public onSelectTransInvestors(investorIds: []): void {
        this.totalAmount = 0;
        this.totalInteres = 0;
        this.totalFee = 0;
        this.totalAmountRecive = 0;
        this.selectedTransInvestors = [...this.investors.filter(investor => investorIds.includes(investor.fsTransInvestorId as never))];
        if (this.selectedTransInvestors.length > 0) {
            this.selectedTransInvestors.forEach(investor => {
                this.totalAmount = this.totalAmount + investor.amount;
                this.totalInteres = this.totalInteres + (investor.interestAtimate);
                this.totalFee = Math.round(this.totalFee + (investor.amount * (this.createRequest.get('feeRate').value / 100)));
            });
            this.totalAmountRecive = this.totalAmount - this.totalFee;
            this.createRequest.get('listTransInvestorId').patchValue(this.selectedTransInvestors.map(value => value.fsTransInvestorId).join(';'));
        } else {
            this.createRequest.get('listTransInvestorId').patchValue('');
        }
    }

    public onAlert(): void {
        const config: FuseConfirmationConfig = {
            title: '',
            message: 'Xác nhận dữ liệu',
            actions: {
                confirm: {
                    label: 'Đồng ý',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.submit();
            }
        });
    };

    public submit(): void {
        this.createRequest.markAllAsTouched();
        if (this.createRequest.valid) {
            this.onSubmit.emit(this.createRequest.value);
        }
    }

    public close(): void {
        this.data.complete();
    }
}
