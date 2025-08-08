import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AdmAccountDetailDTO } from '../../../../../models/admin';
import { TranspayInvestorTransactionService } from '../../../../../service';
import { DialogService } from '../../../../../service/common-service/dialog.service';
import { APP_TEXT } from '../../../../../shared/constants';

@Component({
    selector: 'app-document-sign-dialog',
    templateUrl: './document-sign.component.html',
})
export class DocumentSignDialogComponent implements OnInit {
    formGroup: FormGroup;
    lstAccountApproval: Observable<AdmAccountDetailDTO[]>;
    message = APP_TEXT;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            fsTranspayInvestorId: number;
        },
        private dialogRef: MatDialogRef<DocumentSignDialogComponent>,
        private _transpayInvestorService: TranspayInvestorTransactionService,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
    ) { }

    ngOnInit(): void {
        this.lstAccountApproval = this._transpayInvestorService.lstAccountApproval$;
        this.initForm();
    }

    initForm(): void {
        this.formGroup = this._fb.group({
            fsTranspayInvestorId: this?.data?.fsTranspayInvestorId,
            approvalBy: this._fb.control('', Validators.required),
            note: '',
        });
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if ( !this.formGroup.invalid ) {
            this._transpayInvestorService.doSignTranspayPay(
                this.formGroup.value
            ).subscribe(res => {
                if ( res.errorCode === '0' ) {
                    this.dialogRef.close({ success: true });
                } else {
                    this.dialogRef.close({ success: false });
                }
            });
        }
    }

    isInvalid(formControlName: string): boolean {
        return this.formGroup?.get(formControlName)?.hasError('required')
            && this.formGroup?.get(formControlName)?.touched;
    }
}
