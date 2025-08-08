import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../constants';

@Component({
    selector: 'confirm-processing',
    templateUrl: './confirm-processing.component.html',
    styleUrls: ['confirm-processing.component.css'],
})
export class ConfirmProcessingComponent implements OnInit {
    onSubmit = new EventEmitter();
    confirmProcessForm: UntypedFormGroup;
    appTextConfig = APP_TEXT;
    msgRequireOption = "GDGN006";
    maxlenNote = 100;
    msgRequireNote = "GDGN006";
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            payload: object;
            title: string;
            subTitle: string;
            financialStatement: boolean;
            reportLoanProfileAtt: boolean;
            valueDefault: number;
            valueReject: number;
            choices: [
                {
                    value: number;
                    name: string;
                }
            ];
            maxlenNote?: number;
            msgRequireNote?: string;
            complete: () => void;
        },
        private _matDialogRef: MatDialogRef<ConfirmProcessingComponent>,
        private _formBuilder: FormBuilder,
    ) {
        this._matDialogRef.disableClose = true;
        if (this.data?.maxlenNote) {
            this.maxlenNote =this.data?.maxlenNote;
        }
        if (this.data?.msgRequireNote) {
            this.msgRequireNote =this.data?.msgRequireNote;
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.confirmProcessForm = this._formBuilder.group({
            status: new FormControl(this.data.valueDefault),
            approvalComment: new FormControl(''),
            financialStatement: this.data.financialStatement ? new FormControl('', [Validators.required]) : undefined,
            reportLoanProfileAtt: this.data.reportLoanProfileAtt ? new FormControl('', [Validators.required]) : undefined,
        });
        this.confirmProcessForm.get('status')
            .valueChanges
            .subscribe((value) => {
                if(value === this.data.valueReject) {
                    // this.confirmProcessForm.get('approvalComment').enable();
                    this.confirmProcessForm.get('financialStatement').disable();
                    this.confirmProcessForm.get('reportLoanProfileAtt').disable();

                    this.confirmProcessForm.get('approvalComment').setValidators([Validators.required, Validators.maxLength(this.maxlenNote)]);
                    this.confirmProcessForm.get('financialStatement').clearValidators();
                    this.confirmProcessForm.get('reportLoanProfileAtt').clearValidators();
                } else {
                    // this.confirmProcessForm.get('approvalComment').disable();
                    this.confirmProcessForm.get('financialStatement').enable();
                    this.confirmProcessForm.get('reportLoanProfileAtt').enable();

                    this.confirmProcessForm.get('approvalComment').clearValidators();
                    if (this.data.financialStatement) {
                        this.confirmProcessForm.get('financialStatement').setValidators([Validators.required]);
                    }
                    if (this.data.reportLoanProfileAtt) {
                        this.confirmProcessForm.get('reportLoanProfileAtt').setValidators([Validators.required]);
                    }
                }
                this.confirmProcessForm.get('approvalComment').updateValueAndValidity();
            });
    }

    public submit(): void {
        this.data.payload = {
            ...this.data.payload,
            status: this.confirmProcessForm.get('status').getRawValue(),
            approvalComment: this.confirmProcessForm.get('approvalComment').getRawValue(),
            financialStatement: this.data.financialStatement ? this.confirmProcessForm.get('financialStatement').getRawValue() : undefined,
            reportLoanProfileAtt: this.data.reportLoanProfileAtt ? this.confirmProcessForm.get('reportLoanProfileAtt').getRawValue() : undefined,
        };
        this.confirmProcessForm.markAllAsTouched();
        if (this.confirmProcessForm.valid) {
            this.onSubmit.emit(this.data.payload);
        }
    }

    public close(): void {
        this.data.complete();
    }
}
