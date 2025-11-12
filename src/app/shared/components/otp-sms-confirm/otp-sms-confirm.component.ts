import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenOtpValidator } from '../../validator/forbidden';
import { FuseAlertService, FuseAlertType } from '../../../../@fuse/components/alert';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OtpService } from '../../../service/common-service/otp.service';
import { fuseAnimations } from '@fuse/animations';
import { NgOtpInputConfig } from 'ng-otp-input';

export interface DialogData {
    service: any;
    payload: any;
    title: string;
    content: string;
    resendTime?: number;
    type?: 'SMS' | 'Email';
    complete: () => void;
    autoCloseOnTimeout?: boolean;
}

@Component({
    selector: 'otp-sms-confirm',
    templateUrl: './otp-sms-confirm.component.html',
    styleUrls: ['./otp-sms-confirm.component.scss'],
     animations: fuseAnimations
})
export class OtpSmsConfirmComponent implements OnInit, OnDestroy {
    @ViewChild('otpInputWrapper') otpInputWrapper!: ElementRef;
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    alertAnimationKey = 0;
    public showAlert: boolean = false;
    public smsOtpForm: FormGroup = new FormGroup({});
    public resendTime = 180;
    public typeOtp = 'Email';
    public resendCount = 0; // Đếm số lần gửi lại OTP
    public maxResendAttempts = 3; // Giới hạn tối đa 3 lần
    public isResendLimitReached = false; // Kiểm tra đã vượt quá giới hạn chưa
    public isResendingOtp = false; // Trạng thái đang gửi lại OTP
    public hasUsedAllResends = false; // Đã sử dụng hết lượt gửi lại nhưng vẫn có thể nhập OTP
    private currentInterval: any;
    private countdownEndTime: number; // Timestamp kết thúc countdown

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
        private _formBuilder: FormBuilder,
        private _otpService: OtpService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _fuseAlertService: FuseAlertService,
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
        this.smsOtpForm.reset();
        this.resendCount++; // Tăng số lần gửi lại

        const values = {
            payload: {
                ...this.data.payload
            }
        };
        const resendSubscriber = this.data.service ? this.data.service.resendOtp(values) : this._otpService.resendOtp(values);
        resendSubscriber
            .subscribe(
                (response) => {
                    this.isResendingOtp = false;
                    if (response.errorCode === '0') {
                        // Reset thời gian về 180s và bắt đầu countdown
                        this.resendTime = this.data.resendTime || 180;
                        this.resetTime(this.resendTime);

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
                        this.showError(response.message);
                    }
                },
                (error) => {
                    this.isResendingOtp = false;
                    this.showError(error?.message || 'Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại.');
                }
            );
    }

    onOtpChange(otpValue: string): void {
        this.smsOtpForm.get('smsOtp')?.setValue(otpValue);

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
        // Nếu form invalid -> return
        // if (this.smsOtpForm.invalid) {
        //     return;
        // }
        const otp = (this.smsOtpForm.value.smsOtp ?? '');

        if (otp.length < this.otpConfig.length) {
            //    console.log(otp)
            this.markEmptyInputsRed();
            return;
        }
        // Disable form khi gửi
        this.showAlert = false;

        // ✅ Kiểm tra OTP không hợp lệ: không đủ 4 số hoặc < 1000
        if (!/^\d{4}$/.test(otp) || parseInt(otp, 10) < 1000) {
            this.showError('Mã OTP nhập không chính xác.');
            return;
        }
        this.smsOtpForm.disable();
        const values = {
            payload: {
                ...this.data.payload,
                smsOtp: otp
            }
        };

        const verifySubscriber = this.data.service
            ? this.data.service.verifyOtp(values)
            : this._otpService.verifyOtp(values);

        verifySubscriber.subscribe(
            (response) => {
                if (response.errorCode === '0' || response.errorCode === 0) {
                    this.data.complete();
                } else {
                    this.showError(response.message);
                }
                this.smsOtpForm.enable();
            },
            (error) => {
                this.smsOtpForm.enable();
                this.showError(error?.message || 'Xảy ra lỗi, vui lòng thử lại.');
            }
        );
    }


    resetTime(time): void {
        this.clearAllInterval();
        this.resendTime = time;
        // Lưu timestamp kết thúc = thời điểm hiện tại + số giây cần đếm
        this.countdownEndTime = Date.now() + (time * 1000);

        this.currentInterval = setInterval(() => {
            // Tính thời gian còn lại dựa trên timestamp thực tế
            const remainingMs = this.countdownEndTime - Date.now();
            const remainingSeconds = Math.ceil(remainingMs / 1000);

            if (remainingSeconds > 0) {
                this.resendTime = remainingSeconds;
            } else {
                this.resendTime = 0;
                clearInterval(this.currentInterval);
                this.currentInterval = null;

                if (this.data.autoCloseOnTimeout) {
                    this._fuseAlertService.showMessageErrorAuth('Phiên nhập OTP đã hết hạn, vui lòng yêu cầu gửi lại.')
                    // setTimeout(() => this.dialogRef.close(), 1000);
                    this.dialogRef.close();
                }
            }
        }, 100); // Kiểm tra mỗi 100ms để UI mượt hơn
    }

    showError(message: string): void {
        this.alert = { type: 'error', message };

        // Ẩn alert 1 chút rồi bật lại để kích hoạt animation lại
        this.showAlert = false;
        this.alertAnimationKey++;

        setTimeout(() => {
            this.showAlert = true;
        });
    }


    clearAllInterval(): void {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }

    ngOnDestroy(): void {
        this.clearAllInterval();
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
