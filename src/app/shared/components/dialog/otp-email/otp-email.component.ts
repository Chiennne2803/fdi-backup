import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forbiddenOtpValidator} from '../../../validator/forbidden';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertType} from '../../../../../@fuse/components/alert';
import {AuthService} from '../../../../core/auth/auth.service';
import {User} from '../../../../core/user/user.types';
import {KycServices} from '../../../../service/kyc/kyc.service';

enum Times {
    emailOtp = 180
}

@Component({
    selector     : 'otp-email-confirm',
    templateUrl  : './opt-email.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class OtpEmailComponent implements OnInit {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;
    resendTime = Times.emailOtp;
    emailOtpForm: FormGroup;
    userInfo: User;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _kycService: KycServices,
        public dialogRef: MatDialogRef<OtpEmailComponent>
    ) {
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.userInfo = this._authService.authenticatedUser;
        this.emailOtpForm = this._formBuilder.group({
            payload: this._formBuilder.group({
                mailOtp: this._formBuilder.control(null, [Validators.required, forbiddenOtpValidator()]),
                isEnd: this._formBuilder.control(true),
            })
        });
        this.resetTime(Times.emailOtp);
    }

    resendOtp(time): void {
        this._kycService.sendEmail().subscribe((res) => {
            if (String(res.errorCode) === '0') {
                this.resetTime(time);
            } else {
                this.showError(res.message);
            }
        });
    }

    /**
     * Submit Otp
     */
    submitOtp(): void {
        // Do nothing if the form is invalid
        if (this.emailOtpForm.invalid) {
            return;
        }

        // Disable the form
        this.emailOtpForm.disable();

        // Hide the alert
        this.showAlert = false;
        this._kycService.postDataKyc(this.emailOtpForm.value).subscribe(
            (res) => {
                if (String(res.errorCode) === '0') {
                    this.dialogRef.close(true);
                } else {
                    this.showError(res.message);
                    this.emailOtpForm.enable();
                }
            }
        );
    }

    resetTime(time): void {
        this.clearAllInterval();
        this.resendTime = time;
        const interval = setInterval(async () => {
            if (this.resendTime > 0) {
                this.resendTime = this.resendTime - 1 >= 0 ? this.resendTime - 1 : 0;
                return;
            }
            clearInterval(interval);
        }, 1000);
    }

    showError(message): void {
        // Set the alert
        this.alert = {
            type: 'error',
            message: message
        };

        // Show the alert
        this.showAlert = true;
    }

    clearAllInterval(): void {
        const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

        for (let i = 1; i < intervalId; i++) {
            window.clearInterval(i);
        }
    }
}
