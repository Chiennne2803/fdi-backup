import {Component, Inject, OnInit} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {ManagementStaffService} from 'app/service';
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import CryptoJS from "crypto-js";
import {environment} from "../../../../../../environments/environment";
import {AdmAccountDetailDTO} from "../../../../../models/admin";
import {forbiddenPasswordValidator} from "../../../../../shared/validator/forbidden";
import {DateTimeformatPipe} from "../../../../../shared/components/pipe/date-time-format.pipe";
import {PWChangeValidators} from "../../../../common/profile/components/change-password-dialog/PWChangeValidators";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    providers: [DateTimeformatPipe]
})
export class ChangePasswordComponent implements OnInit {
    public changePasswordForm: FormGroup = new FormGroup({});
    admAccountId: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: number,
        private matDialogRef: MatDialogRef<ChangePasswordComponent>,
        private _formBuilder: FormBuilder,
        private _confirmService: FuseConfirmationService,
        private _staffService: ManagementStaffService,
        private _fuseAlertService: FuseAlertService,
    ) {
        if (this.data) {
            this.admAccountId = data;
        }
    }

    ngOnInit(): void {
        this.changePasswordForm = this._formBuilder.group({
            admAccountId: new FormControl(this.admAccountId),
            newPasswd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), forbiddenPasswordValidator()]),
            reNewPasswd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
        }, {
            // Here we create validators to be used for the group as a whole
            validator: Validators.compose([
                PWChangeValidators.newMatchesConfirm
            ])
        });
    }

    discard(): void {
        if (this.changePasswordForm.dirty) {
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
                    this.matDialogRef.close(false);
                }
            });
            return;
        } else {
            this.matDialogRef.close(false);
        }
    }

    submit(): void {
        this.changePasswordForm.markAllAsTouched();
        if (this.changePasswordForm.valid) {
            if (this.changePasswordForm.dirty) {
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
                    if (res === 'confirmed' && this.changePasswordForm.valid) {
                        const accountDetailDTO = this.changePasswordForm.value;
                        const key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
                        const strPassNew = CryptoJS.AES.encrypt(accountDetailDTO.newPasswd, key, {
                            mode: CryptoJS.mode.ECB,
                            padding: CryptoJS.pad.Pkcs7
                        }).toString();
                        const strPassReNew = CryptoJS.AES.encrypt(accountDetailDTO.reNewPasswd, key, {
                            mode: CryptoJS.mode.ECB,
                            padding: CryptoJS.pad.Pkcs7
                        }).toString();
                        delete accountDetailDTO.reNewPasswd;
                        delete accountDetailDTO.newPasswd;
                        accountDetailDTO.passwd = strPassNew;
                        accountDetailDTO.newPasswd = strPassReNew;
                        this._staffService.changePass(accountDetailDTO).subscribe((result) => {
                            if (result && result.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Đổi password thành công');
                                this.matDialogRef.close(true);
                            } else {
                                this._fuseAlertService.showMessageError(result.message.toString());
                            }
                        });
                    }
                });
                return;
            } else {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
            }
        }
    }

    public getErrorReNewPassword(): string {
        if (this.changePasswordForm.get('reNewPasswd')?.hasError('required')) {
            return 'QLNV033';
        }
    }

    getErrorPassword(): string {
        if (this.changePasswordForm.get('newPasswd')?.hasError('required')) {
            return 'TKDT013';
        }
        if (this.changePasswordForm.get('newPasswd')?.hasError('forbiddenPassword') ||
            this.changePasswordForm.get('newPasswd')?.hasError('minlength') ||
            this.changePasswordForm.get('newPasswd')?.hasError('maxlength')) {
            return 'TKDT010';
        }
    }
}
