import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { FsTransWithdrawCashDTO } from 'app/models/service';
import { ManagementWithdrawHOService } from 'app/service/admin/management-withdraw-ho.service';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { APP_TEXT } from 'app/shared/constants';

@Component({
    selector: 'app-request-withdraw',
    templateUrl: './request-withdraw.component.html',
    styleUrls: ['./request-withdraw.component.scss']
})
export class RequestWithdrawComponent implements OnInit {
    public requestWithdrawForm: FormGroup = new FormGroup({});
    public status = [
        { id: 1, label: 'Soạn thảo' }
    ];

    public defaultAccount: FsTransWithdrawCashDTO;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialogRef: MatDialogRef<RequestWithdrawComponent>,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _managementWithdrawHOService: ManagementWithdrawHOService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.initForm();
        this._managementWithdrawHOService.initWithdrawReq().subscribe((res) => {
            this.defaultAccount = res.payload;
            this.initForm();
        });
    }


    discard(): void {
        if (this.requestWithdrawForm.dirty) {
            const config: FuseConfirmationConfig = {
                title: '',
                message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
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
                    this._matDialogRef.close(false);
                }
            });
            return;
        }
        this._matDialogRef.close(false);
    }

    submit(): void {
        this.requestWithdrawForm.markAllAsTouched();
        if (this.requestWithdrawForm.dirty && this.requestWithdrawForm.valid) {
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
                if (res === 'confirmed') {
                    const request = this.requestWithdrawForm.value;
                    this._managementWithdrawHOService.create(request).subscribe((result) => {
                        if (result.errorCode === '0') {
                            this._matDialogRef.close(true);
                            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        } else {
                            this._fuseAlertService.showMessageError(result.message.toString());
                        }
                    });
                }
            });
        } else {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
        }
    }

    private initForm(): void {
        this.requestWithdrawForm = this._formBuilder.group({
            transCode: new FormControl(this.defaultAccount?.transCode),
            availableBalances: new FormControl(this.defaultAccount?.availableBalances),

            bankName: new FormControl(this.defaultAccount?.bankName, [Validators.required, Validators.maxLength(100)]),
            accNo: new FormControl(this.defaultAccount?.accNo, [Validators.required, Validators.maxLength(100)]),
            accName: new FormControl(this.defaultAccount?.accName, [Validators.required, Validators.maxLength(100)]),
            branchName: new FormControl(this.defaultAccount?.branchName, [Validators.required, Validators.maxLength(100)]),

            amount: new FormControl(this.defaultAccount?.amount, [Validators.required,
                Validators.max(this.defaultAccount ? this.defaultAccount.availableBalances : 0),
                Validators.min(1),
                Validators.maxLength(15)
            ]),
            note: new FormControl(this.defaultAccount?.note, [Validators.maxLength(100)]),
            status: new FormControl({
                value: this.status[0].id,
                disabled: true
            }),
            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true,
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true,
            }),
        });
    }

}
