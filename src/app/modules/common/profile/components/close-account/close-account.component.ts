import {AfterViewInit, Component, OnInit} from '@angular/core';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import {CloseAccountInvestorService} from '../../../../../service/investor/close-account-investor.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {OtpSmsConfirmComponent} from '../../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../../../core/auth/auth.service';
import {ProfileService} from '../../../../../service/common-service';

@Component({
    selector: 'close-account',
    templateUrl: './close-account.component.html',
    animations: fuseAnimations
})
export class CloseAccountComponent implements OnInit, AfterViewInit {
    prepare: {
        investing: boolean;
        transaction: boolean;
        accountBalance: boolean;
    };

    constructor(
        private _closeAccountInvestorService: CloseAccountInvestorService,
        private _fuseAlertService: FuseAlertService,
        private _dialog: MatDialog,
        private _authService: AuthService,
        private _profileService: ProfileService
    ) { }

    get disableSubmit(): boolean {
        return !this.prepare.investing || !this.prepare.transaction || !this.prepare.accountBalance;
    }

    ngOnInit(): void {
        this._closeAccountInvestorService.getPrepareLoadingPage().subscribe((res) => {
            this.prepare = res.payload;
        });
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Đóng tài khoản')
        );
    }

    onSubmit(): void {
        if (!this.disableSubmit) {
            this._closeAccountInvestorService.closeAccountInvestor().subscribe((res) => {
                if (res.errorCode === '0') {
                    const dialogRef = this._dialog.open(OtpSmsConfirmComponent, {
                        data: {
                            payload: {
                                otpType: 'CLOSE_ACCOUNT_INVESTOR',
                            },
                            title: 'Điền mã xác nhận OTP',
                            content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                            complete: () => {
                                dialogRef.close();
                                this._fuseAlertService.showMessageSuccess('Đóng tài khoản thành công');
                                this._authService.signOut();
                            },
                        }
                    });
                } else {
                    this._fuseAlertService.showMessageError(res.message.toString());
                }
            });
        }
    }
}
