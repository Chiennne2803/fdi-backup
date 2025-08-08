import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {
    AddressKycDialogComponent
} from '../../../../../shared/components/dialog/address-dialog/address-dialog.component';
import {IAddressData} from '../../../../../shared/models/address.model';
import {ProfileService} from '../../../../../service/common-service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {OtpSmsConfirmComponent} from '../../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';

@Component({
    templateUrl: './change-gpkd-dialog.component.html',
})
export class ChangeGpkdDialogComponent implements OnInit {
    changeBusinessLicenseForm: FormGroup;
    today: Date = new Date();

    constructor(
        private _matDialogRef: MatDialogRef<ChangeGpkdDialogComponent>,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _profileService: ProfileService,
        private _fuseAlertService: FuseAlertService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    openAddressDialog(): void {
        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '450px',
            data: this.changeBusinessLicenseForm.get('address3').value,
        });
        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload) {
                this.changeBusinessLicenseForm.get('address3').patchValue(res.payload);
            }
        });
    }

    initForm(): void {
        this.changeBusinessLicenseForm = this._formBuilder.group({
            changeInfoType: 'GPKD',
            address3: this._formBuilder.control('', [Validators.required]),
            photoOfBusiness: this._formBuilder.control('', [Validators.required]),
        });
    }

    onSubmit(): void {
        this.changeBusinessLicenseForm.markAllAsTouched();
        if ( this.changeBusinessLicenseForm.valid ) {
            this._profileService.doCreateRequestChangeId(this.changeBusinessLicenseForm.value).subscribe(
                (res) => {
                    if ( res.errorCode === '0' ) {
                        const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                            disableClose: true,
                            data: {
                                payload: {
                                    otpType: 'CREATE_REQUEST_CHANGE_ID',
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký.' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất tạo hồ sơ huy động!',
                                complete: () => {
                                    dialogRef.close();
                                    this._fuseAlertService.showMessageSuccess('Thay đổi thành công');
                                    this._matDialogRef.close();
                                    this._profileService.getPrepareLoadingPage().subscribe();
                                },
                            }
                        });
                    }
                    else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                }
            );
        }
    }

    isInvalid(control: string): boolean {
        return this.changeBusinessLicenseForm.get(control).touched
            && this.changeBusinessLicenseForm.get(control).hasError('required');
    }
}
