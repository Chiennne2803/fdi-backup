import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {ConfRefundService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {FsConfRefundDTO} from '../../../../../models/service/FsConfRefundDTO.model';

@Component({
    selector: 'app-conf-refun',
    templateUrl: './conf-refund.component.html',
    styleUrls: ['./conf-refund.component.scss']
})
export class ConfRefundComponent implements OnInit {
    public detail = new FsConfRefundDTO();
    public isEdit = false;
    public refundForm: FormGroup = new FormGroup({});
    private _dataSearchDialog: object;

    /**
     * constructor
     * @param _configService
     * @param _matDialog
     * @param _fuseAlertService
     */
    constructor(
        private _confRefundService: ConfRefundService,
        private _formBuilder: FormBuilder,
        private _confirmService: FuseConfirmationService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.initData();
    }

    discard(): void {
        if (this.refundForm.dirty) {
            const config: FuseConfirmationConfig = {
                title: '',
                message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
                actions: {
                    confirm: {
                        label: 'Đồng ý',
                        color: 'primary'
                    },
                    cancel: {
                        label: 'Huỷ'
                    }
                }
            };
            const dialog = this._confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.isEdit = false;
                }
            });
            return;
        }  else {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
        }
        this.isEdit = false;
    }
    submit(): void {
        if (this.refundForm.dirty) {
            const dialog = this.openDialogConfirm();
            dialog.afterClosed().subscribe((res) => {
                this.refundForm.markAllAsTouched();
                let request = new FsConfRefundDTO();
                request = this.refundForm.value;

                if (res === 'confirmed' && this.refundForm.valid) {
                    this._confRefundService.update(request).subscribe((response) => {
                        if (response.errorCode === '0') {
                            this._confRefundService.prepare().subscribe();
                            this.refundForm.reset();
                            this.isEdit = false;
                            this.initData();
                            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        } else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                    });
                }
            });
        } else {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
        }
    }

    private initData(): void {
        this._confRefundService.configRefund.subscribe((res) => {
            this.detail = res;
            this.initForm();
        });
    }

    private initForm(): void {
        this.refundForm = this._formBuilder.group({
            fsConfRefundId: new FormControl(this.detail?.fsConfRefundId),

            // minBlance: new FormControl(this.detail?.minBlance, [Validators.required]),
            // percentManager: new FormControl(this.detail?.percentManager, [Validators.required]),

            minLoan: new FormControl(this.detail?.minLoan, [Validators.required, Validators.maxLength(15), Validators.min(0)]),
            maxLoan: new FormControl(this.detail?.maxLoan, [Validators.required, Validators.maxLength(15), Validators.min(0)]),
            rateCapitalPenalty: new FormControl(this.detail?.rateCapitalPenalty, [Validators.required, Validators.min(0)]),
            rateFeePenalty: new FormControl(this.detail?.rateFeePenalty, [Validators.required, Validators.min(0)]),
            percentFee: new FormControl(this.detail?.percentFee, [Validators.required, Validators.maxLength(15)]),
            percentTax: new FormControl(this.detail?.percentTax, [Validators.required, Validators.min(0)]),
            percentTranfer: new FormControl(this.detail?.percentTranfer, [Validators.required, Validators.maxLength(15)]),
            investFee: new FormControl(this.detail?.investFee, [Validators.required]),
            percentTaxCompany: new FormControl(this.detail?.percentTaxCompany, [Validators.required, Validators.min(0)]),
            percentTaxBonus: new FormControl(this.detail?.percentTaxBonus, [Validators.required, Validators.min(0)]),
            percentTaxBonusCompany: new FormControl(this.detail?.percentTaxBonusCompany, [Validators.required, Validators.min(0)]),

            autoInvestExpiration: new FormControl(this.detail?.autoInvestExpiration, [Validators.required, Validators.maxLength(15), Validators.min(1)]),
            refundExpiration: new FormControl(this.detail?.refundExpiration, [Validators.required, Validators.maxLength(15), Validators.min(1)]),
            p2PExpiration: new FormControl(this.detail?.p2PExpiration, [Validators.required, Validators.maxLength(15), Validators.min(1)]),
            stopCapital: new FormControl(this.detail?.stopCapital, [Validators.required, Validators.max(100), Validators.min(0)]),

            p2PRemainingDays: new FormControl(this.detail?.p2PRemainingDays, [Validators.required, Validators.min(1)]),
            accNameByPassMinInvest: new FormControl(this.detail?.accNameByPassMinInvest),
            amountBypassDebt: new FormControl(this.detail?.amountBypassDebt),

            createdByName: new FormControl({
                value: this.detail ? this.detail.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this.detail ? this._datetimePipe.transform(this.detail.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: this.detail ? this.detail.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: this.detail ? this._datetimePipe.transform(this.detail.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

    private openDialogConfirm(): MatDialogRef<FuseConfirmationDialogComponent, any> {
        const config: FuseConfirmationConfig = {
            title: 'Xác nhận lưu dữ liệu',
            message: '',
            actions: {
                confirm: {
                    label: 'Lưu',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        return this._confirmService.open(config);
    }
}
