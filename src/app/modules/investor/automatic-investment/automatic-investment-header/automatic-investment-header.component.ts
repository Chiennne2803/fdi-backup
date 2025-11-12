import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigInvestorService } from '../../../../service/admin/config-investor.service';
import { WControlEuDTO } from '../../../../models/wallet/WControlEuDTO.model';
import { MatDialog } from '@angular/material/dialog';
import { OtpSmsConfirmComponent } from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import { FuseAlertService } from '../../../../../@fuse/components/alert';
import { AutoInvestmentRechargeComponent } from '../auto-investment-recharge-dialog/auto-investment-recharge.component';
import { AuthService } from "../../../../core/auth/auth.service";

@Component({
    selector: 'app-automatic-investment-header',
    templateUrl: './automatic-investment-header.component.html',
})
export class AutomaticInvestmentHeaderComponent implements OnInit {
    autoInvestForm: FormGroup = new FormGroup({});
    wControlEu: WControlEuDTO;
    listInvestmentTime?: number[];
    public fullName = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _configInvestorService: ConfigInvestorService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private authService: AuthService,

    ) {
        this.fullName = this.authService.authenticatedUser.fullName;
    }

    ngOnInit(): void {
        this._configInvestorService.prepare().subscribe();
        this._configInvestorService._dataPrepare.subscribe((res) => {
            if (res) {
                this.wControlEu = res.wControlEuDTO;
                this.listInvestmentTime = res.listInvestmentTime;
            }
        });
        this.initForm();
    }

    initForm(): void {
        this.autoInvestForm = this._formBuilder.group({
            investmentTime: new FormControl(null, [Validators.required]),
            investmentAmount: new FormControl(0, [Validators.required, Validators.min(1)]),
        });
    }
    generateActionKey(prefix: string = 'REG'): string {
        const random = Math.floor(Math.random() * 1000); // random 0-999
        const millis = Date.now(); // milliseconds since epoch
        return `${prefix}${random}${millis}`;
    }

    onSubmit(): void {
        const actionKey = this.generateActionKey()
        this.autoInvestForm.markAllAsTouched();
        if (this.autoInvestForm.valid) {
            this._configInvestorService
                .create({
                    ...this.autoInvestForm.value,
                    actionKey: actionKey
                })
                .subscribe((res) => {
                    if (res.errorCode === '0') {
                        const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                            disableClose: true,
                            data: {
                                payload: {
                                    otpType: 'INVESTOR_AUTO_OTP',
                                    actionKey: actionKey
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất đặt lệnh đầu tư tự động!',
                                complete: () => {
                                    dialogRef.close();
                                    this.initForm();
                                    this._configInvestorService.doSearch().subscribe();
                                    this._configInvestorService.prepare().subscribe();
                                    this._fuseAlertService.showMessageSuccess('Đặt lệnh đầu tư tự động thành công');
                                },
                            }
                        });
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
        }
    }

    onClickRecharge(): void {
        this._configInvestorService.prepare().subscribe();
        this._configInvestorService._dataPrepare.subscribe((res) => {
            if (res) {
                this.wControlEu = res.wControlEuDTO;
            }
        });
        const rechargeDialog = this._matDialog.open(AutoInvestmentRechargeComponent, {
            disableClose: true,
            data: { account: this.wControlEu },
        });
    }
}
