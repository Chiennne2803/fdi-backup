import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FuseAlertService, FuseAlertType} from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { TransWithdrawCashService } from 'app/service';
import { OtpSmsConfirmComponent } from 'app/shared/components/otp-sms-confirm/otp-sms-confirm.component';
import { finalize } from 'rxjs';
import {ROUTER_CONST} from '../../../constants';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'make-withdraw-dialog',
    templateUrl: './make-withdraw-dialog.component.html',
    providers: [DatePipe]
})

export class MakeWithdrawDialogsComponent implements OnInit {
    public currentDate = new Date();
    withdrawForm: FormGroup = new FormGroup({});
    public info: any;
    public createdByName: string;
    public createdDate: any;
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            withdrawDetail: any;
            complete: () => void;
        },
        public authService: AuthService,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _withdrawService: TransWithdrawCashService,
        private _router: Router,
        private _authService: AuthService,
        private datePipe: DatePipe
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        this.createdByName = this._authService.authenticatedUser.fullName;
        this.createdDate = new Date();
        this.info = this.data.withdrawDetail ? this.data.withdrawDetail.info : '';
        // Create the form
        this.withdrawForm = this._formBuilder.group({
            amount: new FormControl(null, [
                Validators.required,
                Validators.min(1),
                Validators.maxLength(15)
            ]),
        });
    }

    transWithdrawCash(): void {
        // Return if the form is invalid
        if (this.withdrawForm.invalid) {
            return;
        }

        // Disable the form
        this.withdrawForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.data.withdrawDetail = {
            ...this.data.withdrawDetail,
            amount: this.withdrawForm.value.amount
        };

        // Forgot password
        this._withdrawService.transWithdrawCash('', this.data.withdrawDetail)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.withdrawForm.enable();
                })
            )
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        this.data.complete();
                        this.openDialog();
                    } else {
                        // Show the alert
                        this.showAlert = true;

                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: response.message.toString()
                        };
                    }
                },
                (response) => {
                    // Show the alert
                    this.showAlert = true;

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: response.message
                    };
                }
            );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: 'TRANS_WITHDRAW_CASH_OTP',
                    smsOtp: 'resend'
                },
                title: 'Điền mã xác nhận OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất rút tiền đầu tư',
                complete: () => {
                    this._fuseAlertService.showMessageSuccess('Tạo giao dịch rút tiền đầu tư thành công');
                    this._withdrawService.doSearch().subscribe();
                    dialogRef.close();
                    this.back();
                },
            }
        });
    };
    back(): void {
        this._router.navigate([ROUTER_CONST.config.investor.withdraw.link]);
    }
}
