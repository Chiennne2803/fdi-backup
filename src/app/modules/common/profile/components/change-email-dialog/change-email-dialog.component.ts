import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProfileService} from '../../../../../service/common-service/profile.service';
import {DialogService} from "../../../../../service/common-service/dialog.service";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {Subscription, tap} from "rxjs";
import {AdmAccountDetailDTO} from "../../../../../models/admin";
import {forbiddenPhoneNumberValidator} from "../../../../../shared/validator/forbidden";
import {OtpSmsConfirmComponent} from "../../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component";
import {fuseAnimations} from "../../../../../../@fuse/animations";

@Component({
    selector: 'change-email-dialog',
    templateUrl: './change-email-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ChangeEmailDialogComponent implements OnInit {
    public changeEmail: FormGroup = new FormGroup({});
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;
    changeEmailStep: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        private matDialogRef: MatDialogRef<ChangeEmailDialogComponent>,
        private _formBuilder: FormBuilder,
        private _profileService: ProfileService,
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService
    ) {
    }

    get canSubmit(): boolean {
        return this.changeEmail?.value?.mobile
            && this.changeEmail?.value?.newMobile;
    }

    ngOnInit(): void {
        this.initForm();
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountDetail = res.accountDetail;
                    this.initForm(this.accountDetail);
                })
            ).subscribe()
        );

    }

    discard(): void {
        this.matDialogRef.close(false);
    }

    private initForm(accountDetail?: AdmAccountDetailDTO): void {
        this.changeEmail = this._formBuilder.group({
            email: new FormControl(accountDetail ? accountDetail.email : null,
                [Validators.required, Validators.email, Validators.maxLength(100)]),
            },
        );
    }

    verifyContactInfo() {

        this._profileService.verifyContactInfo({
            ...this.changeEmail.value,
            changeInfoType: 'EMAIL',
            admAccountDetailId: this.accountDetail.admAccountDetailId
        }).subscribe((res) => {
            if (res.errorCode === '0') {
                const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                    disableClose: true,
                    data: {
                        payload: {
                            otpType: 'USER_CHANGE_VERIFY_EMAIL',
                        },
                        title: 'Điền mã xác nhận OTP',
                        content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                            'Vui lòng kiểm tra và điền vào mã xác nhận!',
                        type: 'Email',
                        resendTime: 300,
                        complete: () => {
                            dialogRef.close();
                            this.changeEmailStep = 1;
                            this.changeEmail.get('email').patchValue('')
                        },
                    }
                });
            } else {
                this._fuseAlertService.showMessageError(res.message.toString());
            }
            this.changeEmail.enable();
        });

    }

    changeContactInfo() {
        this.changeEmail.markAllAsTouched();
        if (this.changeEmail.valid) {
            this._profileService.changeContactInfo({
                ...this.changeEmail.value,
                changeInfoType: 'EMAIL',
                admAccountDetailId: this.accountDetail.admAccountDetailId
            }).subscribe((res) => {
                if (res.errorCode === '0') {
                    const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                        disableClose: true,
                        data: {
                            payload: {
                                otpType: 'USER_CHANGE_EMAIL',
                            },
                            type: 'Email',
                            title: 'Điền mã xác nhận OTP',
                            content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                                'Vui lòng kiểm tra và điền vào mã xác nhận!',
                            resendTime: 300,
                            complete: () => {
                                this.changeEmailStep = 0;
                                dialogRef.close();
                                this.discard();
                                this._profileService.getPrepareLoadingPage().subscribe();
                                this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                            },
                        }
                    });
                } else {
                    this._fuseAlertService.showMessageError(res.message.toString());
                }
                this.changeEmail.enable();
            });
        }
    }
}
