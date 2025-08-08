import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FsLoanProfilesDTO, FsTransWithdrawCashDTO} from 'app/models/service';

interface DialogData {
    prepareData: {
        investorTime: number;
        remainingAmount: number;
        statusName: string;
        wlEu: number;
    };
    loanProfile: FsLoanProfilesDTO;
}

@Component({
    selector: 'withdraw-information-dialog',
    templateUrl: './withdraw-information-dialog.component.html',
})
export class WithdrawInformationDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            baseData: FsTransWithdrawCashDTO;
            complete: () => void;
        },
        private matDialogRef: MatDialogRef<WithdrawInformationDialogComponent>,
    ) { }

    ngOnInit(): void {}

    close(): void {
        this.matDialogRef.close(false);
    }
}
