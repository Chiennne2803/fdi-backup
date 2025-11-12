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
    selector: 'change-mobile-dialog',
    templateUrl: './change-mobile-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ChangeMobileDialogComponent implements OnInit {
    public changeMobile: FormGroup = new FormGroup({});
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;
    changeMobileStep: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        private matDialogRef: MatDialogRef<ChangeMobileDialogComponent>,
        private _formBuilder: FormBuilder,
        private _profileService: ProfileService,
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService
    ) {
    }

    get canSubmit(): boolean {
        return this.changeMobile?.value?.mobile
            && this.changeMobile?.value?.newMobile;
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
        this.changeMobile = this._formBuilder.group({
                mobile: new FormControl(accountDetail ? accountDetail.mobile : 0,
                    [Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            },
        );
    }

    verifyContactInfo() {

        this._profileService.verifyContactInfo({
            ...this.changeMobile.value,
            changeInfoType: 'MOBILE',
            admAccountDetailId: this.accountDetail.admAccountDetailId
        }).subscribe((res) => {
            if (res.errorCode === '0') {
                const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                    disableClose: true,
                    data: {
                        payload: {
                            otpType: 'USER_CHANGE_VERIFY_MOBILE',
                        },
                        title: 'Điền mã xác nhận OTP',
                        content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                            'Vui lòng kiểm tra và điền vào mã xác nhận!',
                        complete: () => {
                            dialogRef.close();
                            this.changeMobileStep = 1;
                            this.changeMobile.get('mobile').patchValue('')
                        },
                    }
                });
            } else {
                this._fuseAlertService.showMessageError(res.message.toString());
            }
            this.changeMobile.enable();
        });

    }

    changeContactInfo() {
        this.changeMobile.markAllAsTouched();
        if (this.changeMobile.valid) {
            this._profileService.changeContactInfo({
                ...this.changeMobile.value,
                changeInfoType: 'MOBILE',
                admAccountDetailId: this.accountDetail.admAccountDetailId
            }).subscribe((res) => {
                if (res.errorCode === '0') {
                    const dialogRef = this._matDialog.open(OtpSmsConfirmComponent, {
                        disableClose: true,
                        data: {
                            payload: {
                                otpType: 'USER_CHANGE_MOBILE',
                            },
                            title: 'Điền mã xác nhận OTP',
                            content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                                'Vui lòng kiểm tra và điền vào mã xác nhận!',
                            complete: () => {
                                this.changeMobileStep = 0;
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
                this.changeMobile.enable();
            });
        }
    }
}
