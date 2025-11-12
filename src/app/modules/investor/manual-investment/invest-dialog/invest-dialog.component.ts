import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FsLoanProfilesDTO } from '../../../../models/service';
import { InvestorService } from '../../../../service';
import { FuseAlertService } from '../../../../../@fuse/components/alert';
import { OtpSmsConfirmComponent } from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import { BaseRequest } from '../../../../models/base';
import FileSaver from 'file-saver';
import { FileService } from '../../../../service/common-service';

interface DialogData {
    prepareData: {
        investorTime: number;
        remainingAmount: number;
        statusName: string;
        wlEu: number;
    };
    loanProfile: FsLoanProfilesDTO;
    onClose?: () => void;
}

@Component({
    selector: 'invest-dialog',
    templateUrl: './invest-dialog.component.html',
})
export class InvestDialogComponent implements OnInit {
    investForm: UntypedFormGroup;
    interestEstimate: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private matDialogRef: MatDialogRef<InvestDialogComponent>,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _investorService: InvestorService,
        private _fileService: FileService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.investForm = this._formBuilder.group({
            amount: new FormControl(null, [
                Validators.required,
                Validators.min(1),
                Validators.max(Math.min(this.data.prepareData.wlEu, this.data.prepareData.remainingAmount))
            ]),
            isTrusted: new FormControl(false, [Validators.requiredTrue]),
        });

        this.investForm.get('amount')
            .valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged(),
            )
            .subscribe((value) => {
                this.interestEstimate = Math.round(value * (this.data.loanProfile.rate / 365 / 100) * this.data.prepareData.investorTime);
            });
    }

    onSubmit(): void {
        this.investForm.markAllAsTouched();
        if (this.investForm.valid) {
            this._investorService
                .create({ amount: this.investForm.get('amount').value, fsLoanProfilesId: this.data.loanProfile.fsLoanProfilesId })
                .subscribe((res) => {
                    if (res.errorCode === '0') {
                        const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                            disableClose: true,
                            data: {
                                payload: {
                                    otpType: 'INVESTOR_PROFILES_OTP',
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất đầu tư tự chọn!',
                                complete: () => {
                                    dialogRef.close();
                                    this.discard();
                                    this._investorService.getAllLoanActiveProfile(new BaseRequest()).subscribe();
                                    this._investorService.getPrepareLoadingPage().subscribe();
                                    this._fuseAlertService.showMessageSuccess('Đầu tư thành công');
                                    this.data.onClose();
                                },
                            }
                        });
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
        }
    }

    discard(): void {
        this.matDialogRef.close(false);
    }

    downloadContract(): void {
        this._investorService
            .downloadContract({ fsLoanProfilesId: this.data?.loanProfile?.fsLoanProfilesId })
            .subscribe((res) => {
                if (res && res.payload) {
                    const { fileType, contentBase64, docName } = res.payload;
                    if (fileType && contentBase64) {
                        FileSaver.saveAs(
                            this._fileService.dataURItoBlob(fileType + contentBase64),
                            docName || 'contract.pdf'
                        );
                    } else {
                        console.error('Thiếu dữ liệu fileType hoặc contentBase64:', res.payload);
                    }
                } else {
                    console.error('API không trả về payload hợp lệ:', res);
                }
            });
    }

}
