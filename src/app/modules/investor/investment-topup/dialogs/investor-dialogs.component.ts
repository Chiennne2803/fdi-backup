import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TopupService} from 'app/service/investor/topup.service';
import {OtpSmsConfirmComponent} from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {TransWithdrawCashService} from 'app/service/investor/trans-withdraw-cash.service';
import {FsTopupDTO} from 'app/models/service/FsTopupDTO.model';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {ROUTER_CONST} from 'app/shared/constants';
import {Router} from '@angular/router';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
    selector: 'topup-trans-pay-create-dialog',
    templateUrl: './topup-trans-pay-create-dialog.component.html',
})
export class TopupDialog implements OnInit{
    public topUp: FsTopupDTO;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            infoTransPay: any;
        },
        private matDialogRef: MatDialogRef<TopupDialog>,
        private _topUpService: TopupService,
        private _dialog: MatDialog,
        private _withdrawService: TransWithdrawCashService,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
        private clipboard: Clipboard
    ) {
      matDialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this._topUpService.getPrepareLoadingPage().subscribe((res) => {
            this.topUp = res.payload;
        });
    }

    discard(): void {
        this.matDialogRef.close(false);
    }

    public topUpAction(): void {
            this._topUpService.create(this.topUp).subscribe((resTopUp) => {
                if (resTopUp.errorCode === '0') {
                    this.sendOtp('TOPUP_OTP', 'Tạo giao dịch nạp tiền đầu tư thành công');
                } else {
                    this._fuseAlertService.showMessageError(resTopUp.message.toString());
                }
            });
    };

    sendOtp(otpType: string, message: string): void {
        const dialogRef = this._dialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: otpType,
                },
                title: 'Điền mã xác nhận OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                complete: () => {
                    dialogRef.close();
                    this._fuseAlertService.showMessageSuccess(message);
                    this._topUpService.doSearch().subscribe();
                    this.back();
                },
            }
        });
    };

    back(): void {
        this._router.navigate([ROUTER_CONST.config.investor.topupInvestment.link]);
    }

    coppy(text: string | undefined) {
        this.clipboard.copy(text);
        this._fuseAlertService.showMessageSuccess("copied", 500)
    }
}
