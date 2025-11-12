import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FsTransInvestorDTO} from '../../../../../models/service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT, ROUTER_CONST} from 'app/shared/constants';
import {MatSelectChange} from '@angular/material/select';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogService} from 'app/service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {OtpSmsConfirmComponent} from 'app/shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {Router} from '@angular/router';
import {FsReqTransP2PService} from 'app/service/admin/req-trans-p2p.service';

@Component({
    selector: 'app-add-dialog',
    templateUrl: './create-transfer-dialog.component.html',
    styleUrls: ['./create-transfer-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTransferDialogComponent implements OnInit {
    loanProfileSelection: [];
    loanProfileSelectionFilter: number[];
    transInvestorSelection: any[];
    transInvestorSelectionFilter: any[];
    transInvestorData: FsTransInvestorDTO;
    formGroup: FormGroup;
    message = APP_TEXT;
    constructor(
        private dialogRef: MatDialogRef<CreateTransferDialogComponent>,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _alertService: FuseAlertService,
        private _fsReqTransP2PService: FsReqTransP2PService,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
    ) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this._fsReqTransP2PService.prepareP2P$.subscribe((res) => {
            this.loanProfileSelection = res.payload.fsLoanProfiles;
            this.loanProfileSelectionFilter = this.loanProfileSelection;
        });
        this.formGroup = this._fb.group({
            fsLoanProfilesId: this._fb.control('', Validators.required),
            transCode: this._fb.control('', Validators.required),
            transferAmount: this._fb.control({value: '', disabled: true}, [
                Validators.required,
                Validators.pattern('[1-9][0-9]*'),
                Validators.min(1)
            ]),
            saleAmount: this._fb.control({value: '', disabled: true}, [
                Validators.required,
                Validators.pattern('[1-9][0-9]*'),
                Validators.min(1)
            ]),
            feeP2P: this._fb.control({value: '', disabled: true}),
        });
    }

    onChangeSelect(event: MatSelectChange, type: string): void {
        switch (type) {
            case 'loanProfile':
                this.transInvestorData = null;
                this.formGroup.get('transferAmount').enable();
                this.formGroup.get('saleAmount').enable();
                this.formGroup.patchValue({
                    transCode: null,
                });
                this._fsReqTransP2PService.getListInvestByLoanId({fsLoanProfilesId: event.value}).subscribe(
                    (res) => {
                        this.transInvestorSelection = res.payload;
                        this.transInvestorSelectionFilter = this.transInvestorSelection;
                    }
                );
                break;
            case 'transInvestor':
                this.transInvestorData = this.transInvestorSelection.filter(value => value === event.value)[0];
                this.formGroup.get('feeP2P').patchValue(this.transInvestorData.feeP2P);
                break;
            default:
        }
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if ( this.formGroup.valid ) {
            const payload = {
                fsTransInvestorId: this.transInvestorData.fsTransInvestorId,
                tranferAmount: this.formGroup.get('transferAmount').value,
                saleAmount: this.formGroup.get('saleAmount').value
            };
            const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            confirmDialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this._fsReqTransP2PService.create(payload).subscribe(
                        (resCreate) => {
                            if ( resCreate.errorCode === '0' ) {
                                this.dialogRef.close({ success: true });
                                this.sendOtp('TRANS_REQ_INVESTOR_P2P_OTP', 'Tạo giao dịch chuyển nhượng thành công!');

                            } else {
                                this._alertService.showMessageError(resCreate.message.toString());
                            }
                        }
                    );
                }
            });
        }
    }

    sendOtp(otpType: string, message: string): void {
        const dialog = this._dialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: otpType,
                },
                title: 'Điền mã xác nhận OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                complete: () => {
                    dialog.close();
                    this._fuseAlertService.showMessageSuccess(message);
                    this._fsReqTransP2PService.getListBuy().subscribe();
                    this.back();
                },
            }
        });
    };

    closeDialog(): void {
        if ( this.formGroup.get('fsLoanProfilesId').value ) {
            const confirmDialog = this._dialogService.openConfirmDialog('Dữ liệu đang thao tác trên màn hình sẽ bị mất, xác nhận thực hiện ?');

            confirmDialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this.dialogRef.close();
                }
            });
        } else {
            this.dialogRef.close();
        }
    }

    isInvalid(formControlName: string): boolean {
        return this.formGroup?.get(formControlName)?.hasError('required')
            && this.formGroup?.get(formControlName)?.touched;
    }

    isInvalidTransferAmount(): string {
        if (this.formGroup?.get('transferAmount')?.touched) {
            if (this.formGroup?.get('transferAmount')?.hasError('required')) {
                return 'INVP30005';
            } else if (this.formGroup?.get('transferAmount')?.hasError('min')) {
                return 'INVP30010';
            } else if (this.formGroup?.get('transferAmount')?.hasError('pattern')) {
                return 'INVP30006';
            }
        }
    }

    isInvalidSaleAmount(): string {
        if (this.formGroup?.get('saleAmount')?.touched) {
            if (this.formGroup?.get('saleAmount')?.hasError('required')) {
                return 'INVP30011';
            } else if (this.formGroup?.get('saleAmount')?.hasError('min')) {
                return 'INVP30013';
            } else if (this.formGroup?.get('saleAmount')?.hasError('pattern')) {
                return 'INVP30012';
            }
        }
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.investor.investmentTransfer.offer.link]);
    }

    public onKey(target): void {
        if (target.value) {
            this.loanProfileSelectionFilter = this.search(target.value);
        } else {
            this.loanProfileSelectionFilter = this.loanProfileSelection;
        }
    }

    public onKeyTransInvestor(target): void {
        if (target.value) {
            this.transInvestorSelectionFilter = this.searchTransInvestor(target.value);
        } else {
            this.transInvestorSelectionFilter = this.transInvestorSelection;
        }
    }

    public search(value: string): any {
        return this.loanProfileSelectionFilter.filter(option => option.toString().includes(value));
    }

    public searchTransInvestor(value: string): any {
        return this.transInvestorSelection.filter(option => option.investorCode.toString().includes(value));
    }
}
