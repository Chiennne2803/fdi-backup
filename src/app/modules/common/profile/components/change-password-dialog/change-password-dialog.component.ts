import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProfileService} from '../../../../../service/common-service/profile.service';
import {AdmAccountDTO} from '../../../../../models/admin/AdmAccountDTO.model';
import {PWChangeValidators} from "./PWChangeValidators";
import {DialogService} from "../../../../../service/common-service/dialog.service";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import CryptoJS from "crypto-js";
import {environment} from "../../../../../../environments/environment";
import {OtpSmsConfirmComponent} from "../../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component";
import {forbiddenPasswordValidator} from "../../../../../shared/validator/forbidden";

@Component({
    selector: 'change-password-dialog',
    templateUrl: './change-password-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent implements OnInit {
    public changePasswordForm: FormGroup = new FormGroup({});

    constructor(
        private matDialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        private _formBuilder: FormBuilder,
        private _profileService: ProfileService,
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService
    ) { }

    get canSubmit(): boolean {
        return this.changePasswordForm?.value?.passwd
            && this.changePasswordForm?.value?.newPasswd
            && this.changePasswordForm?.value?.reNewPasswd;
    }

    ngOnInit(): void {
        this.initForm();
    }

    discard(): void {
        this.matDialogRef.close(false);
    }

    changePassword(): void {
        if (this.changePasswordForm.invalid) {
            return;
        }
        const dialogSubmit = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
        dialogSubmit.afterClosed().subscribe((action) => {
            if (action === 'confirmed') {
                this.changePasswordForm.disable();

                const key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
                const oldPass = CryptoJS.AES.encrypt(this.changePasswordForm.get("passwd").value, key, {
                    mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
                }).toString();
                const newPass = CryptoJS.AES.encrypt(this.changePasswordForm.get("newPasswd").value, key, {
                    mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
                }).toString();

                const payload = {
                    passwd: oldPass,
                    newPasswd: newPass,
                    reNewPasswd: newPass
                } as AdmAccountDTO;
                this._profileService.changePassword(payload).subscribe((res) => {
                    if (res.errorCode === '0') {
                        const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                            disableClose: true,
                            data: {
                                payload: {
                                    otpType: 'USER_CHANGE_PASS',
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận!',
                                complete: () => {
                                    dialogRef.close();
                                    this.discard();
                                    this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                                },
                            }
                        });
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                    this.changePasswordForm.enable();
                });

            }
        });


    }

    private initForm(): void {
        this.changePasswordForm = this._formBuilder.group({
                passwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), forbiddenPasswordValidator()]),
                newPasswd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), forbiddenPasswordValidator()]),
                reNewPasswd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
            }, {
                // Here we create validators to be used for the group as a whole
                validator: Validators.compose([
                    PWChangeValidators.newIsNotOld,
                    PWChangeValidators.newMatchesConfirm
                ])
            }
        );
    }

    public getErrorPassword(): string {
        if (this.changePasswordForm.get('newPasswd')?.hasError('required')) {
            return 'TKDT013';
        }
        if (this.changePasswordForm.get('newPasswd')?.hasError('forbiddenPassword') ||
            this.changePasswordForm.get('newPasswd')?.hasError('minlength') ||
            this.changePasswordForm.get('newPasswd')?.hasError('maxlength')) {
            return 'TKDT010';
        }
    }

    public getErrorReNewPassword(): string {
        if (this.changePasswordForm.get('reNewPasswd')?.hasError('required')) {
            return 'TKDT016';
        }
        if (this.changePasswordForm.get('reNewPasswd')?.hasError('forbiddenPassword') ||
            this.changePasswordForm.get('reNewPasswd')?.hasError('minlength') ||
            this.changePasswordForm.get('reNewPasswd')?.hasError('maxlength')) {
            return 'TKDT010';
        }
    }

    public getErrorOldPassword(): string {
        if (this.changePasswordForm.get('passwd')?.hasError('required')) {
            return 'TKDT011';
        }
        if (this.changePasswordForm.get('passwd')?.hasError('forbiddenPassword') ||
            this.changePasswordForm.get('passwd')?.hasError('minlength') ||
            this.changePasswordForm.get('passwd')?.hasError('maxlength')) {
            return 'QLTK001';
        }
    }
}
