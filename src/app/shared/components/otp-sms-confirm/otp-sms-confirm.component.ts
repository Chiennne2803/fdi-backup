import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forbiddenOtpValidator} from '../../validator/forbidden';
import {FuseAlertType} from '../../../../@fuse/components/alert';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OtpService} from '../../../service/common-service/otp.service';

export interface DialogData {
    service: any;
    payload: any;
    title: string;
    content: string;
    resendTime?: number;
    type?: 'SMS' | 'Email';
    complete: () => void;
}

@Component({
    selector     : 'otp-sms-confirm',
    templateUrl  : './otp-sms-confirm.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class OtpSmsConfirmComponent implements OnInit {
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    public showAlert: boolean = false;
    public smsOtpForm: FormGroup = new FormGroup({});
    public resendTime = 120;
    public typeOtp = "SMS";

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _otpService: OtpService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<OtpSmsConfirmComponent>
        ) {
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        if (this.data.type) {
            this.typeOtp = this.data.type.toString();
        }
        if (this.data.resendTime) {
            this.resendTime = this.data.resendTime;
        }
        this.smsOtpForm = this._formBuilder.group({
            smsOtp: new FormControl(null, [Validators.required, forbiddenOtpValidator(), Validators.maxLength(4)]),
        });
        this.resetTime(this.resendTime);
    }

    /**
     *
     * Resend OTP
     */
    resendOtp(): void {
        this.smsOtpForm.reset();
        const values = {
            payload: {
                ...this.data.payload
            }
        };
        const resendSubscriber = this.data.service ? this.data.service.resendOtp(values) : this._otpService.resendOtp(values);
        resendSubscriber
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        this.resendTime = this.data.resendTime?? 120;
                        this.resetTime(this.resendTime);
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
        if (this.smsOtpForm.invalid) {
            return;
        }
        console.log(this.smsOtpForm.value)

        // Disable the form
        this.smsOtpForm.disable();

        // Hide the alert
        this.showAlert = false;

        const values = {
            payload: {
                ...this.data.payload,
                smsOtp: this.smsOtpForm.value.smsOtp
            }
        };
        const verifySubscriber = this.data.service ? this.data.service.verifyOtp(values) : this._otpService.verifyOtp(values);

        verifySubscriber
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        this.data.complete();
                    } else {
                        this.showError(response.message);
                    }
                    // Re-enable the form
                    this.smsOtpForm.enable();
                },
                (error) => {

                    // Re-enable the form
                    this.smsOtpForm.enable();

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
