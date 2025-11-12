import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forbiddenOtpValidator } from '../../../validator/forbidden';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '../../../../../@fuse/components/alert';
import { AuthService } from '../../../../core/auth/auth.service';
import { User } from '../../../../core/user/user.types';
import { KycServices } from '../../../../service/kyc/kyc.service';
import { NgOtpInputConfig } from 'ng-otp-input';
import { fuseAnimations } from '@fuse/animations';

enum Times {
    emailOtp = 180
}

@Component({
    selector: 'otp-email-confirm',
    templateUrl: './opt-email.component.html',
    styles: [`
    ::ng-deep .input-otp {
        width: 50px !important;
        height: 50px !important;
        border: 1px solid #ccc !important;
        border-radius: 8px !important;
        text-align: center !important;
        font-size: 20px !important;
        margin: 0 5px !important;
        transition: all 0.2s ease;
    }

    ::ng-deep .input-otp:focus {
        border-color: var(--fuse-primary) !important;
        box-shadow: 0 0 5px rgba(40, 84, 242, 0.4);
    }

    ::ng-deep .input-otp-error {
        border-color: #f44336 !important;
        animation: shake 0.2s ease-in-out 0s 2;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    `],
    animations: fuseAnimations
})
export class OtpEmailComponent implements OnInit {
    @ViewChild('otpInputWrapper') otpInputWrapper!: ElementRef;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;
    resendTime: number = Times.emailOtp;
    emailOtpForm: FormGroup;
    userInfo: User;
    public resendCount = 0; // Đếm số lần gửi lại OTP
    public maxResendAttempts = 3; // Giới hạn tối đa 3 lần
    public isResendLimitReached = false; // Kiểm tra đã vượt quá giới hạn chưa
    public isResendingOtp = false; // Trạng thái đang gửi lại OTP
    public hasUsedAllResends = false; // Đã sử dụng hết lượt gửi lại nhưng vẫn có thể nhập OTP
    private countdownEndTime: number; // Timestamp kết thúc countdown
    private countdownInterval: any;

    otpConfig: NgOtpInputConfig = {
        length: 4,
        inputClass: 'input-otp',
        allowNumbersOnly: true,
        disableAutoFocus: false,
        placeholder: '',
    };
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
                mailOtp: this._formBuilder.control(null, [Validators.required]),
                isEnd: this._formBuilder.control(true),
            })
        });
        this.resetTime(Times.emailOtp);
    }

    resendOtp(time): void {
        // Kiểm tra giới hạn số lần gửi lại
        if (this.resendCount >= this.maxResendAttempts) {
            this.isResendLimitReached = true;
            this.showError('Bạn đã gửi lại OTP quá nhiều lần. Vui lòng thực hiện lại quá trình để lấy mã OTP mới.');
            return;
        }

        // Kiểm tra đang trong quá trình gửi lại
        if (this.isResendingOtp) {
            return;
        }

        this.isResendingOtp = true;
        this.resendCount++; // Tăng số lần gửi lại

        this._kycService.sendEmail().subscribe((res) => {
            this.isResendingOtp = false;
            if (String(res.errorCode) === '0') {
                this.resetTime(time);

                // Kiểm tra nếu đã sử dụng hết lượt gửi lại
                if (this.resendCount >= this.maxResendAttempts) {
                    this.hasUsedAllResends = true;
                    this.showError('Bạn đã sử dụng hết số lần gửi lại OTP. Vui lòng nhập mã OTP hiện tại để tiếp tục.');
                } else {
                    // Hiển thị thông báo số lần còn lại
                    const remainingAttempts = this.maxResendAttempts - this.resendCount;
                    this.showError(`Mã OTP đã được gửi lại. Bạn còn ${remainingAttempts} lần gửi lại.`);
                }
            } else {
                this.showError(res.message);
            }
        }, (error) => {
            this.isResendingOtp = false;
            this.showError(error?.message || 'Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại.');
        });
    }

    onOtpChange(otpValue: string): void {
        this.emailOtpForm.get('payload.mailOtp')?.setValue(otpValue);

        const inputs = this.otpInputWrapper?.nativeElement.querySelectorAll('.input-otp');
        if (inputs?.length) {
            inputs.forEach((input: HTMLInputElement) => {
                // Nếu có ký tự thì bỏ viền đỏ
                if (input.value) {
                    input.classList.remove('input-otp-error');
                }
            });
        }

        // Khi đã nhập đủ -> clear toàn bộ lỗi
        if (otpValue && otpValue.length === this.otpConfig.length) {
            this.clearErrorBorders();
        }
    }

    /**
     * Submit Otp
     */
    submitOtp(): void {
        // Do nothing if the form is invalid
        // if (this.emailOtpForm.invalid) {
        //     return;
        // }
        const otp = this.emailOtpForm.value.payload.mailOtp
        console.log(otp)
        if (otp.length < this.otpConfig.length) {
            this.markEmptyInputsRed();
            return;
        }
        this.showAlert = false;
        // Disable the form
        this.emailOtpForm.disable();
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
        // Lưu timestamp kết thúc = thời điểm hiện tại + số giây cần đếm
        this.countdownEndTime = Date.now() + (time * 1000);

        this.countdownInterval = setInterval(() => {
            // Tính thời gian còn lại dựa trên timestamp thực tế
            const remainingMs = this.countdownEndTime - Date.now();
            const remainingSeconds = Math.ceil(remainingMs / 1000);

            if (remainingSeconds > 0) {
                this.resendTime = remainingSeconds;
            } else {
                this.resendTime = 0;
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
        }, 100); // Kiểm tra mỗi 100ms để UI mượt hơn
    }

    showError(message: string): void {
        // Set the alert
        this.alert = {
            type: 'error',
            message: message
        };

        // Show the alert
        this.showAlert = true;
    }

    clearAllInterval(): void {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
    private markEmptyInputsRed(): void {
        const inputs = this.otpInputWrapper?.nativeElement.querySelectorAll('.input-otp');
        if (inputs?.length) {
            inputs.forEach((input: HTMLInputElement) => {
                if (!input.value) {
                    input.classList.add('input-otp-error');
                } else {
                    input.classList.remove('input-otp-error');
                }
            });
        }
    }

    private clearErrorBorders(): void {
        const inputs = this.otpInputWrapper?.nativeElement.querySelectorAll('.input-otp-error');
        if (inputs?.length) {
            inputs.forEach((input: HTMLInputElement) => input.classList.remove('input-otp-error'));
        }
    }
}
