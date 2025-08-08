import {Component, Inject, OnInit} from '@angular/core';
import {TranspayReqTransactionService} from '../../../../../service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../../../../shared/constants';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FsTranspayReqDTO} from '../../../../../models/service';

@Component({
    selector: 'app-process-dialog',
    templateUrl: './process-dialog.component.html',
    styleUrls: ['./process-dialog.component.scss'],
})
export class ProcessDialogComponent implements OnInit {
    formGroup: FormGroup;
    message = APP_TEXT;
    lstTranspayReq: FsTranspayReqDTO[];
    statusTopupMailTrans: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public matDialogData: {
            transPayReq: FsTranspayReqDTO;
        },
        private dialogRef: MatDialogRef<ProcessDialogComponent>,
        private _transPayReqService: TranspayReqTransactionService,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
    ) { }

    ngOnInit(): void {
        this._transPayReqService.transPayReqDetail$.subscribe(
            (res) => {
                this.statusTopupMailTrans = res.topupMailTransferDTO.status;
                if (this.statusTopupMailTrans === 2 || this.statusTopupMailTrans === 6) {
                    this.lstTranspayReq = res.listTranspayReqWait;
                }

                if (this.statusTopupMailTrans === 3) {
                    this.lstTranspayReq = [res];
                }
            }
        );
        this.initForm();
    }

    initForm(): void {
        this.formGroup = this._fb.group({
            transPayReq: this._fb.control({
                    value: this.matDialogData?.transPayReq || null,
                    disabled: (this.statusTopupMailTrans !== 2 && this.statusTopupMailTrans !== 6)
                },
                Validators.required),
            paidAmount: this._fb.control({
                value: this.matDialogData?.transPayReq?.paidBankAmount,
                disabled: true
            }, Validators.required),
        });
        this.formGroup.get('transPayReq').valueChanges.subscribe((data: FsTranspayReqDTO) => {
            this.formGroup.get('paidAmount').patchValue(data.paidBankAmount)
        })
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if ( !this.formGroup.invalid ) {
            this.dialogRef.close(this.formGroup.value);
        }
    }

    isInvalid(formControlName: string): boolean {
        return this.formGroup?.get(formControlName)?.hasError('required')
            && this.formGroup?.get(formControlName)?.touched;
    }
}
