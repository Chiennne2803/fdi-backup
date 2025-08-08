import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {WControlEuDTO} from '../../../../models/wallet/WControlEuDTO.model';
import {ConfigInvestorService} from '../../../../service/admin/config-investor.service';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {OtpSmsConfirmComponent} from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';

@Component({
    selector: 'auto-investment-recharge-dialog',
    templateUrl: './auto-investment-recharge.component.html',
})
export class AutoInvestmentRechargeComponent implements OnInit {
    topupAmount: FormControl;
    suggestAmount: Array<number> = new Array(6);
    showTopUpAutoInvestAmount: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            account: WControlEuDTO;
        },
        private _fb: FormBuilder,
        private _dialogRef: MatDialogRef<AutoInvestmentRechargeComponent>,
        private _configInvestorService: ConfigInvestorService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) {
        this._dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.initForm();
        this.generateSuggestedAmount(0);
    }

    initForm(): void {
        this.topupAmount = this._fb.control(
            0,
            [
                Validators.required,
                Validators.min(1),
                Validators.max(this.data.account.weu)
            ]
        );
    }

    generateSuggestedAmount2($event: any): void {
        this.generateSuggestedAmount(this.topupAmount.value);
    }

    generateSuggestedAmount(startValue: number): void {
        if (startValue && startValue.toString().length > 6) {
            return;
        }
        const MULTIPLES = 10;
        const FIXED_AMOUNT = 10000000;
        for (let i = 0; i < this.suggestAmount.length; i++) {
            let amount: number = 0;
            if (startValue === 0 || !startValue) {
                amount = (i + 1) * FIXED_AMOUNT;
            } else {
                amount = startValue * Math.pow(MULTIPLES, i + 1);
            }
            this.suggestAmount[i] = amount;
        }
    }

    onSubmit(): void {
        this.topupAmount.markAsTouched();
        if (this.topupAmount.valid) {
            const payload = {
                topupAmount: this.topupAmount.value
            };
            this._configInvestorService.topupAutoInvest(payload).subscribe(
                (res) => {
                    if (res.errorCode === '0') {
                        const otpDialog = this._matDialog.open(OtpSmsConfirmComponent, {
                            disableClose: true,
                            data: {
                                payload: {
                                    otpType: 'TOPUP_AUTO_INVEST_OTP',
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất nạp tiền đầu tư tự động!',
                                complete: () => {
                                    this._dialogRef.close();
                                    otpDialog.close();
                                    this._fuseAlertService.showMessageSuccess('Nạp tiền đầu tư tự động thành công');
                                    // Subscribe to observe newest data
                                    this._configInvestorService.prepare().subscribe();
                                },
                            }
                        });
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                }
            );
        }
    }

}
