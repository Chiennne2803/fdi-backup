import {Component, EventEmitter, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../../../core/auth/auth.service';
import {
    FsLoanProfilesDTO,
    FsTransInvestorDTO,
    FsTranspayReqDTO
} from "../../../../../models/service";
import {FsCardDownDTO} from "../../../../../models/service";
import {FsCardDownInvestorDTO} from '../../../../../models/service/FsCardDownInvestorDTO.model';
import {MatSelectChange} from '@angular/material/select';
import {LoanProfilesService} from '../../../../../service';

@Component({
    selector: 'fs-card-down-detail-dialog',
    templateUrl: './fs-card-down-detail-dialog.component.html',
})
export class FSCardDownDetailDialog {
    constructor(
        @Inject(MAT_DIALOG_DATA) public selectedFsCardDown: {
            fsCardDown: FsCardDownDTO,
            fsLoanProfiles: FsLoanProfilesDTO,
            investors: FsCardDownInvestorDTO[],
        },
    ) {}
}

@Component({
    selector: 'fs-trans-pay-detail-dialog',
    templateUrl: './fs-trans-pay-detail-dialog.component.html',
})
export class FSTransPayDetailDialog {
    constructor(
        @Inject(MAT_DIALOG_DATA) public selectedTransPay: {
            lstTranspayReq: FsTranspayReqDTO[],
        },
    ) {}
}

@Component({
    selector: 'fs-card-down-create-dialog',
    templateUrl: './fs-card-down-create-dialog.component.html',
})
export class FSCardDownCreateDialog {
    public currentDate = new Date();
    public date = new Date();
    public selectInvestorsFC = new FormControl('');
    public selectedInvestors: FsTransInvestorDTO[] = [];
    public listTransInvestorId: string;
    onSubmit = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public prepareDisbursementRequest: {
            fsCardDown: FsCardDownDTO,
            investors: FsTransInvestorDTO[],
        },
        public authService: AuthService,
    ) {}

    public onSelectInvestor(investorIds: []): void {
       this.selectedInvestors = [...this.prepareDisbursementRequest.investors.filter(investor => {
            return investorIds.includes(investor.fsTransInvestorId as never);
        })];
        this.listTransInvestorId = this.selectedInvestors.map(o => o.fsTransInvestorId).join(';');
    }

    public submit(): void {
        this.onSubmit.emit({
            'listTransInvestorId': this.listTransInvestorId,
            'transCode': this.prepareDisbursementRequest.fsCardDown.transCode,
        });
    }
}

@Component({
    selector: 'fs-trans-pay-create-dialog',
    templateUrl: './fs-trans-pay-create-dialog.component.html',
})
export class FSTransPayCreateDialog {
    public currentDate = new Date();
    public paymentPeriod: FsTranspayReqDTO;
    onSubmit = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            fsLoanProfiles: FsLoanProfilesDTO,
            lstCardDowns: FsCardDownDTO[]
        },
        public authService: AuthService,
        private _loanProfilesService: LoanProfilesService,
    ) {}

    public onSelectCardDown(event: MatSelectChange): void {
      /*  this._loanProfilesService
            .getTranspayPeriodByCardDown({ fsCardDownId: event.value })
            .subscribe(res => {
                this.transPayPeriods = res.payload.lstTranspayPeriod;
            })*/
    }

    public onSelectPaymentPeriod(event: MatSelectChange): void {
        this._loanProfilesService
            .initTranspayReqByTranspayPeriod({ fsTranspayPeriodId: event.value })
            .subscribe((res) => {
                this.paymentPeriod = res.payload;
            });
    }

    public submit(): void {
        this.onSubmit.emit(this.paymentPeriod);
    }
}
