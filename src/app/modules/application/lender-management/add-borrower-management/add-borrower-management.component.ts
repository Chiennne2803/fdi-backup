import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { ROUTER_CONST } from 'app/shared/constants';
import { CorporateBorrowerComponent } from './corporate-borrower/corporate-borrower.component';
import { PersonalBorrowerComponent } from './personal-borrower/personal-borrower.component';
import {UserType} from '../../../../enum';
import {OtpSmsConfirmComponent} from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {MatDialog} from '@angular/material/dialog';
import CryptoJS from 'crypto-js';
import {environment} from '../../../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {ManagementLenderService} from '../../../../service';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-add-borrower-management',
    templateUrl: './add-borrower-management.component.html',
    styleUrls: ['./add-borrower-management.component.scss'],
    providers: [DateTimeformatPipe, CdkScrollable]
})
export class AddBorrowerManagementComponent implements OnInit {
    @ViewChild(PersonalBorrowerComponent) personal: PersonalBorrowerComponent;
    @ViewChild(CorporateBorrowerComponent) corporate: CorporateBorrowerComponent;
    userType = UserType;
    public borrowerType: number = this.userType.CA_NHAN;

    constructor(
        private _borrowerService: ManagementLenderService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            this.borrowerType = parseInt(params.type, 10);
        });
    }

    submit(): void {
        const form = this.borrowerType === this.userType.CA_NHAN ? this.personal.personForm : this.corporate.businessForm;
        form.markAllAsTouched();
        if (form.valid) {
            this._borrowerService.create(this.prepareRequest(form))
                .subscribe((res) => {
                    if (res.errorCode !== "0") {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    } else {
                        this.sendOtp();
                    }
                });
        }
    }

    prepareRequest(form: FormGroup) {
        const key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
        let formEncryptPass = {
            ...form.value,
            passwd: CryptoJS.AES.encrypt(form.get('passwd').value, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(),
        };
        if (this.borrowerType === this.userType.CA_NHAN) {
            formEncryptPass = {
                ...formEncryptPass,
                dateOfIdnumber: new Date(form.get('dateOfIdnumber').value).getTime(),
                dateOfBirth: new Date(form.get('dateOfBirth').value).getTime(),
            };
        } else {
            let deputyContact = {
                ...form.get('deputyContact').value,
                dateOfBirth: new Date(form.get('deputyContact').get('dateOfBirth').value).getTime(),
                idDate: new Date(form.get('deputyContact').get('idDate').value).getTime(),
            };
            formEncryptPass = {
                ...formEncryptPass,
                deputyContact,
            };
        }
        return formEncryptPass;
    }

    sendOtp(): void {
        const dialogRef = this._dialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: "ACCOUNT_LENDER_REQUEST",
                },
                title: 'Điền mã xác nhận OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                complete: () => {
                    dialogRef.close();
                    const dialogEmailRef = this._dialog.open(OtpSmsConfirmComponent, {
                        disableClose: true,
                        data: {
                            payload: {
                                otpType: 'USER_REGISTER',
                            },
                            title: 'Điền mã xác nhận OTP',
                            content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                                'Vui lòng kiểm tra và điền vào mã xác nhận!',
                            type: 'Email',
                            resendTime: 180,
                            complete: () => {
                                this._fuseAlertService.showMessageSuccess('Tạo mới bên huy động vốn thành công');
                                this.back();
                                this._borrowerService.doSearch().subscribe();
                                dialogEmailRef.close();
                            },
                        }
                    });
                },
            }
        });
    };

    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.borrower.link]);
    }
}
