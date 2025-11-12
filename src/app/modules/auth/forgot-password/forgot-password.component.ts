import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';
import {finalize} from 'rxjs';
import {emailValidator, forbiddenPhoneNumberValidator, forbiddenUserNameValidator} from 'app/shared/validator/forbidden';
import {DialogData, OtpSmsConfirmComponent} from 'app/shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ForgetPasswordService} from "../../../service/admin/forget-password.service";
import {AdmAccountDetailDTO} from "../../../models/admin";
import {random} from "lodash-es";

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit {
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup = new FormGroup({});
    showAlert: boolean = false;
    private actionKey = "";
    /**
     * Constructor
     */
    constructor(
        private _forgetPasswordService: ForgetPasswordService,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            username: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [ Validators.required, emailValidator()]),
        });
        this.actionKey = "REG" +random(100) + "" + new Date().getMilliseconds();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        let payload = new AdmAccountDetailDTO();
        payload.accountName = this.forgotPasswordForm.value.username;
        payload.email = this.forgotPasswordForm.value.email;
        payload.actionKey = this.actionKey;

        // Forgot password
        this._forgetPasswordService.sendOtpRecoverPassword(payload)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.forgotPasswordForm.enable();
                })
            )
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        this.openDialog();
                    } else {
                        // Show the alert
                        this.showAlert = true;
                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: response.message
                        };
                    }
                },
                (response) => {
                    // Show the alert
                    this.showAlert = true;

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Không tìm thấy email! Bạn có chắc bạn đã là một thành viên?'
                    };
                }
            );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(OtpSmsConfirmComponent, {
            data: {
                service: this._forgetPasswordService,
                payload: {
                    otpType: "USER_FORGOT_PASSWORD",
                    userName: this.forgotPasswordForm.value.username,
                    actionKey : this.actionKey,
                },
                title: 'Nhập mã xác thực OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. Vui lòng kiểm tra và điền mã xác nhận để hoàn tất lấy lại mật khẩu!',
                complete: () => {
                    dialogRef.close();
                    const successDialogRef = this.dialog.open(SentUrlDialog, {
                        data: {
                            complete: () => {
                                successDialogRef.close();
                            },
                        }
                    });
                },
            }
        });
    };
}

@Component({
    selector: 'sent-url',
    templateUrl: './sent-url-dialog.component.html',
})
export class SentUrlDialog {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public authService: AuthService,
    ) {}

    redirectLogin(): any {
        return this.data.complete();
    }
}
