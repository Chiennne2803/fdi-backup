import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FsChargeCashReqDTO} from "../../../../../models/service/FsChargeCashReqDTO.model";

@Component({
    selector: 'app-resolve-error-cash-dialog',
    templateUrl: './resolve-error-cash-dialog.component.html',
    styleUrls: ['./resolve-error-cash-dialog.component.scss']
})
export class ResolveErrorCashDialogComponent implements OnInit {
    onSubmit = new EventEmitter();
    lstChargeCashReqDTOS: FsChargeCashReqDTO[] = [];
    rechargeRequestForm: UntypedFormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            lstChargeCashReqDTOS: FsChargeCashReqDTO[];
            fsChargeCashReqDTO: FsChargeCashReqDTO
            status: number;
            complete: () => void;
        },
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this.rechargeRequestForm = this._formBuilder.group({
            fsChargeCashReqId: (this.data.status === 7 || this.data.status === 6 || this.data.status === 2) ? new FormControl(null, Validators.required) : new FormControl(),
            amount: (this.data.status === 6 || this.data.status === 3) ? new FormControl(this.data.fsChargeCashReqDTO.amount, [Validators.required, Validators.min(1)]) : new FormControl(),
        });
        this.lstChargeCashReqDTOS = this.data.lstChargeCashReqDTOS;
    }

    public onKey(target): void {
        if (target.value) {
            this.lstChargeCashReqDTOS = this.search(target.value);
        } else {
            this.lstChargeCashReqDTOS = this.data.lstChargeCashReqDTOS;
        }
    }

    public search(value: string): any {
        return this.lstChargeCashReqDTOS.filter(option => option.transCode.toLowerCase().includes(value.toLowerCase()));
    }

    discard(): void {
        this.data.complete();
    }

    public submit(): void {
        // Return if the form is invalid
        if (this.rechargeRequestForm.invalid) {
            return;
        }
        if (this.rechargeRequestForm.valid) {
            this.onSubmit.emit(this.rechargeRequestForm.value);
        }
    }

    /*submit(): void {
        const config: FuseConfirmationConfig = {
            title: 'Xác nhận lưu dữ liệu',
            message: '',
            actions: {
                confirm: {
                    label: 'Lưu',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed' && this.resolveRequestForm.valid) {
                const request = this.resolveRequestForm.value;
                this._manageCashInReqService.processErrorReq(request).subscribe((result) => {
                    if (result.errorCode === '0') {
                        this._matDialogRef.close(true);
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    } else {
                        this._fuseAlertService.showMessageError(result.message.toString());
                    }
                });
            }
        });
    }*/
}
