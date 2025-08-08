import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {FuseAlertService, FuseAlertType} from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {
    forbiddenPasswordValidator,
    forbiddenPhoneNumberValidator,
    emailValidator, forbiddenUserNameValidator
}
    from 'app/shared/validator/forbidden';
import CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {OtpConfirmComponent} from 'app/shared/components/otp-confirm/otp-confirm.component';
import FileSaver from 'file-saver';
import {FileService} from "../../../service/common-service";
import {OtpSmsConfirmComponent} from "../../../shared/components/otp-sms-confirm/otp-sms-confirm.component";
import {random} from "lodash-es";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';

enum Steps {
    form = 1,
    rules = 2,
    privacyPolicy = 3,
    complete = 4,
}
@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    public step = Steps.form;
    public signUpForm: FormGroup = new FormGroup({});
    public showAlert: boolean = false;
    public roles = [
        { id: 1, value: 'Nhà đầu tư' },
        { id: 2, value: 'Bên huy động vốn' }
    ];
    public objects = [
        { id: 1, value: 'Cá nhân' },
        { id: 2, value: 'Doanh nghiệp' }
    ];
    public steps = Steps;
    disableSubmitButton: boolean = true;
    private actionKey = "";
    // htmlContent: any;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        public _dialog: MatDialog,
        private _fileService: FileService,
        private _fuseAlertService: FuseAlertService,
        private _router: Router
    ) {
        // this.htmlContent = "";
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.createForm();
        this.observeFormValue();
        this.actionKey = "REG" +random(100) + "" + new Date().getMilliseconds();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createForm(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            role: new FormControl(null, [Validators.required]),
            object: new FormControl(null, [Validators.required]),
            accountName: new FormControl(null, [Validators.required, forbiddenUserNameValidator()]),
            email: new FormControl(null, [ emailValidator()]),
            mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            passwd: new FormControl(null, [Validators.required, forbiddenPasswordValidator()]),
            codePresenter: new FormControl(null, [Validators.minLength(6), Validators.maxLength(50)]),
            codeStaff: new FormControl(null, [Validators.minLength(6), Validators.maxLength(50)]),
            agreements: new FormControl(null, [Validators.requiredTrue])
        });
    }

    observeFormValue(): void {
        this.signUpForm.valueChanges.subscribe(() => {
            this.disableSubmitButton = this.signUpForm.invalid;
        });
    }

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        const key = CryptoJS.enc.Utf8.parse(environment.encryptKey || '');
        const pwAES = CryptoJS.MD5(this.signUpForm.value?.passwd?.trim()).toString();

        this._authService.signUp({
            payload: {
                actionKey : this.actionKey,
                accountName: this.signUpForm.value.accountName,
                passwd: pwAES,
                type: this.signUpForm.value.role,
                codePresenter: this.signUpForm.value.codePresenter,
                codeStaff: this.signUpForm.value.codeStaff,
                admAccountDetailDTO: {
                    email: this.signUpForm.value.email,
                    mobile: this.signUpForm.value.mobile,
                    type: this.signUpForm.value.object,
                },
            }
        })
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        // this.openDialog();
                        this.sendOtp('USER_REGISTER', 'Đăng ký thành công');
                    } else {
                        this.showError(response.message);
                    }
                    // Re-enable the form
                    this.signUpForm.enable();
                },
                (error) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    this.showError(error);
                }
            );
    }

    showError(message): void {
        // Set the alert
        this.alert = {
            type: 'error',
            message: message
        };

        // Show the alert
        this.showAlert = true;
    }

  /*  openDialog(): void {
        const dialogRef = this._dialog.open(OtpConfirmComponent, {
            data: {
                accountName: this.signUpForm.value.accountName,
                complete: () => {
                    this.step = Steps.complete;
                    dialogRef.close();
                },
                disableClose: true
            }
        });
    };*/


    sendOtp(otpType: string, message: string): void {
        const dialogRef = this._dialog.open(OtpSmsConfirmComponent, {
            data: {
                service: this._authService,
                payload: {
                    otpType: otpType,
                    actionKey : this.actionKey
                },
                title: 'Nhận mã xác thực',
                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                complete: () => {

                    // console.log(message);
                    // this._fuseAlertService.showMessageSuccess(message);
                    // this.step = Steps.complete;
                    this._router.navigateByUrl('sign-in');
                     this._fuseAlertService.showMessageSuccess(message)
                    dialogRef.close();
                },
            }
        });
    };

    changeObjType() {
        if (this.signUpForm.get('role').value === 1) {
            this.signUpForm.patchValue({
                object: 1, //chi co doanh nghiep
            });
        } else if (this.signUpForm.get('role').value === 2) {
            this.signUpForm.patchValue({
                object: 2, //chi co ca nhan
            });
        } else {
            this.signUpForm.patchValue({
                object: null
            });
        }
    }

    downloadRulesDoc(): void {
        // this.step = Steps.rules;
        this._authService.downloadRulesDoc().subscribe((res) => {
            // this.htmlContent = atob(res.payload);
            FileSaver.saveAs(this._fileService.dataURItoBlob(res.payload.contentBase64), res.payload.docName);
        });
    }
    downloadSecurityDoc(): void {
        // this.step = Steps.privacyPolicy;
        this._authService.downloadSecurityDoc().subscribe((res) => {
            // this.htmlContent = atob(res.payload);
            FileSaver.saveAs(this._fileService.dataURItoBlob(res.payload.contentBase64), res.payload.docName);
        });
    }

    convertTLowerCase() {
        if (this.signUpForm.get('accountName').value) {
            this.signUpForm.get('accountName').patchValue(this.signUpForm.get('accountName').value.toString().toLowerCase());
        }
    }

    public getErrorAccount(): string {
        if (this.signUpForm.get('accountName')?.hasError('required')) {
            return 'DKTK006';
        }

        if (this.signUpForm.get('accountName')?.hasError('forbiddenUserName') ||
            this.signUpForm.get('accountName')?.hasError('minlength') ||
            this.signUpForm.get('accountName')?.hasError('maxlength')) {
            return 'DKTK005';
        }
    }
    getErrorPassword() {
        if (this.signUpForm.get('passwd')?.hasError('required')) {
            return 'DKTK014';
        }

        if (this.signUpForm.get('passwd')?.hasError('forbiddenPassword') ||
            this.signUpForm.get('passwd')?.hasError('minlength') ||
            this.signUpForm.get('passwd')?.hasError('maxlength')) {
            return 'DKTK013';
        }
    }

    public getErrorMobile(): string {
        if (this.signUpForm.get('mobile')?.hasError('required')) {
            return 'DKTK012';
        }

        if (this.signUpForm.get('mobile')?.hasError('forbiddenPhoneNumber') ||
            this.signUpForm.get('mobile')?.hasError('minlength') ||
            this.signUpForm.get('mobile')?.hasError('maxlength')) {
            return 'DKTK010';
        }
    }
}
