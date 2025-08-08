import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { fuseAnimations } from '@fuse/animations';
import { AdmAccountType } from 'app/core/user/user.types';
import { AdmCategoriesDTO } from 'app/models/admin';
import { AccountModel, FsAccountBankDTO } from 'app/models/service/FsAccountBankDTO.model';
import { ProfileService } from 'app/service/common-service';
import * as moment from 'moment';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {DialogService} from "../../../../../service/common-service/dialog.service";
import {ChangeMobileDialogComponent} from "../change-mobile-dialog/change-mobile-dialog.component";
import {ChangeEmailDialogComponent} from "../change-email-dialog/change-email-dialog.component";
import {AuthService} from "../../../../../core/auth/auth.service";
import {OtpSmsConfirmComponent} from "../../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component";
@Component({
    selector: 'account-manager',
    templateUrl: './account-manager.component.html',
    animations: fuseAnimations
})

export class AccountManagerComponent implements OnInit, AfterViewInit {
    accountForm: FormGroup = new FormGroup({});
    account: AccountModel;
    listBank: AdmCategoriesDTO[] = [];
    listBankFilter: AdmCategoriesDTO[] = [];
    admAccountType: AdmAccountType;

    constructor(
        private _profileService: ProfileService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _dialogService: DialogService,
        private _authService: AuthService,
        // private matDialogRef: MatDialogRef<AccountManagerComponent>,
    ) {
    }

    get accountType(): number {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        return user.accountType;
    }

    get isNotAdmin(): boolean {
        return this.accountType !== AdmAccountType.ADMIN;
    }

    get canSubmit(): boolean {
        switch (this.accountType) {
            case AdmAccountType.ADMIN:
                return false;
            case AdmAccountType.BORROWER:
            case AdmAccountType.INVESTOR:
                return (this.account?.accountBank?.accName !== this.accountForm?.value?.accName
                    || this.account?.accountBank?.bankName !== this.accountForm?.value?.bankName
                    || this.account?.accountBank?.accNo !== this.accountForm?.value?.accNo
                    || this.account?.accountBank?.bankBranch !== this.accountForm?.value?.bankBranch)
                    && this.accountForm?.value?.accName
                    && this.accountForm?.value?.bankName
                    && this.accountForm?.value?.accNo
                    && this.accountForm?.value?.bankBranch
                    && this.accountForm?.value?.accName;
            default:
                return false;
        }
    }

    ngOnInit(): void {
        this.initForm();
        this._profileService.profilePrepare$.subscribe((res) => {
            this.account = res;
            this.listBank = res.lstBank;
            this.listBankFilter = res.lstBank;
            this.initForm(res);
        });
        this.admAccountType = this._authService.authenticatedUser.accountType;
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Quản lí tài khoản')
        );
    }

    update(): void {
        if (this.accountForm.invalid) {
            return;
        }
        const confirmDialog = this._dialogService.openConfirmDialog('Đây là thông tin tài khoản nhận tiền của bạn. Hãy bảo đảm thông tin đăng ký là chính xác !');
        confirmDialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                this.accountForm.disable();
                const payload = {
                    payload: {
                        accName: this.accountForm.value.accName,
                        accNo: this.accountForm.value.accNo,
                        accType: this.accountForm.value.accType,
                        admAccountId: this.accountForm.value.admAccountId,
                        bankBranch: this.accountForm.value.bankBranch,
                        bankId: this.accountForm.value.bankId,
                        bankName: this.accountForm.value.bankName,
                        fsAccountBankId: this.accountForm.value.fsAccountBankId,
                        status: this.accountForm.value.status,
                    }
                } as FsAccountBankDTO;
                this._profileService.updateAccountBank(payload).subscribe((res) => {
                    if (res.errorCode === '0') {
                        const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                            disableClose: true,
                            data: {
                                payload: {
                                    otpType: 'UPDATE_ACCOUNT_BANK',
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận!',
                                complete: () => {
                                    dialogRef.close();
                                    // this.discard();
                                    this._fuseAlertService.showMessageSuccess('Cập nhật thành công');
                                    this._profileService.getPrepareLoadingPage().subscribe((result) => {
                                        this.account = result.payload;
                                        this.listBank = result.payload.lstBank;
                                        this.listBankFilter = result.payload.lstBank;
                                        this.initForm(result.payload);
                                    });
                                },
                            }
                        });
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
                this.accountForm.enable();
            }
        });


    }

    cancel(): void {
        const dialog = this._dialogService.openConfirmDialog('Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện');
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.initForm(this.account);
            }
        });

    }

    changeBank(event: MatSelectChange): void {
        const bankId = event.value;
        const bankSelect = this.listBank.filter(item => item.admCategoriesId === bankId);
        this.accountForm.controls['bankName'].setValue(bankSelect[0].categoriesName);
    }

    public changePassword(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        let dialog;
        setTimeout(() => {
            dialog = this._matDialog.open(ChangePasswordDialogComponent, dialogConfig);
        }, 0);

    }

    public changeMobileNumber(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.data = 0;
        let dialog;
        setTimeout(() => {
            dialog = this._matDialog.open(ChangeMobileDialogComponent, dialogConfig);
        }, 0);

    }

    public changeEmail(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.data = 0;
        let dialog;
        setTimeout(() => {
            dialog = this._matDialog.open(ChangeEmailDialogComponent, dialogConfig);
        }, 0);

    }

    private initForm(data?: AccountModel): void {
        this.accountForm = this._formBuilder.group({
            accountName: new FormControl(data ? data.accountDetail.accountName : null, [Validators.required]),
            accName: new FormControl(data ? data.accountBank.accName : null, [Validators.required]),
            accNo: new FormControl(data ? data.accountBank.accNo : null, [Validators.required]),
            accType: new FormControl(data ? data.accountBank.accType : null),
            accEmail: new FormControl(data ? data.accountDetail.email : null, [Validators.required]),
            accPhoneNumber: new FormControl(data ? data.accountDetail.mobile : null, [Validators.required]),
            admAccountId: new FormControl(data ? data.accountBank.admAccountId : null),
            bankBranch: new FormControl(data ? data.accountBank.bankBranch : null, [Validators.required]),
            bankId: new FormControl(data ? data.accountBank.bankId : null),
            bankName: new FormControl(data ? data.accountBank.bankName : null, [Validators.required]),
            fsAccountBankId: new FormControl(data ? data.accountBank.fsAccountBankId : null),
            status: new FormControl(data ? data.accountBank.status : null),
            createdByName: new FormControl({
                value: data ? data.accountDetail.createdByName : null,
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data ? data.accountDetail.lastUpdatedByName : null,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data ? moment(data.accountDetail.createdDate).format('DD/MM/YYYY hh:mm:ss') : null,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data ? moment(data.accountDetail.lastUpdatedDate).format('DD/MM/YYYY hh:mm:ss') : null,
                disabled: true
            }),
        });
    }

    onKey(target): void {
        if (target.value) {
            this.listBankFilter = this.search(target.value);
        } else {
            this.listBankFilter = this.listBank;
        }
    }

    search(value: string): any {
        return this.listBank.filter(option => option.categoriesName.toLowerCase().includes(value.toLowerCase()));
    }

    // discard(): void {
    //     this.matDialogRef.close(false);
    // }
}
