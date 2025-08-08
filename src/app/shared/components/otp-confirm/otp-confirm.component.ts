import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forbiddenOtpValidator} from '../../validator/forbidden';
import {FuseAlertType} from '../../../../@fuse/components/alert';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../@fuse/animations';


export interface DialogData {
    accountName: string;
    complete: () => void;
}

enum Times {
    smsOtp = 60,
    emailOtp = 180
}

@Component({
    selector     : 'otp-confirm',
    templateUrl  : './otp-confirm.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OtpConfirmComponent implements OnInit {
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    public showAlert: boolean = false;
    public smsOtpForm: FormGroup = new FormGroup({});
    public emailOtpForm: FormGroup = new FormGroup({});
    public resendTime = Times.smsOtp;
    public isEmailOtp = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<OtpConfirmComponent>
        ) {
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.smsOtpForm = this._formBuilder.group({
            smsOtp: new FormControl(null, [Validators.required, forbiddenOtpValidator()]),
        });
        this.emailOtpForm = this._formBuilder.group({
            emailOtp: new FormControl(null, [Validators.required, forbiddenOtpValidator()]),
        });
        this.resetTime(Times.smsOtp);
    }

    /**
     *
     * Resend OTP
     */
    resendOtp(time): void {
        const values: { payload: { userName: string; smsOtp?: 'resend'; mailOtp?: 'resend' } } = {
            payload: {
                userName: this.data.accountName,
            }
        };
        if (time === Times.smsOtp) {
            values.payload.smsOtp = 'resend';
        } else {
            values.payload.mailOtp = 'resend';
        }
        this._authService.resendOtp(values)
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        this.resetTime(time);
                    } else {
                        this.showError(response.message);
                    }
                },
                (error) => {
                    this.showError(error);
                }
            );
    }

    /**
     * Submit Otp
     */
    submitOtp(): void {
        // Do nothing if the form is invalid
        if (!this.isEmailOtp) {
            if (this.smsOtpForm.invalid) {
                return;
            }
        } else {
            if (this.emailOtpForm.invalid) {
                return;
            }
        }

        // Disable the form
        this.smsOtpForm.disable();
        this.emailOtpForm.disable();

        // Hide the alert
        this.showAlert = false;

        const values: { payload: { userName: string; smsOtp?: string; mailOtp?: string } } = {
            payload: {
                userName: this.data.accountName,
            }
        };
        if (!this.isEmailOtp) {
            values.payload.smsOtp = this.smsOtpForm.value.smsOtp;
        } else {
            values.payload.mailOtp = this.emailOtpForm.value.emailOtp;
        }

        this._authService.verifyOtp(values)
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        if (!this.isEmailOtp) {
                            this.isEmailOtp = true;
                            this.resetTime(Times.emailOtp);
                        } else {
                            this.data.complete();
                        }
                    } else {
                        this.showError(response.message);
                    }
                    // Re-enable the form
                    this.smsOtpForm.enable();
                    this.emailOtpForm.enable();
                },
                (error) => {

                    // Re-enable the form
                    this.smsOtpForm.enable();
                    this.emailOtpForm.enable();

                    this.showError(error);
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
