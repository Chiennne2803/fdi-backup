import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {
    forbiddenPasswordValidator,
    forbiddenPhoneNumberValidator,
    emailValidator, forbiddenUserNameValidator
}
    from 'app/shared/validator/forbidden';
import CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import FileSaver from 'file-saver';
import { FileService } from "../../../service/common-service";
import { OtpSmsConfirmComponent } from "../../../shared/components/otp-sms-confirm/otp-sms-confirm.component";
import { random } from "lodash-es";
import { Router } from '@angular/router';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
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


    isPassFocused = false;
    isAccountFocused = false;


    // Các rule kiểm tra mật khẩu
    get hasMinLength() {
        const v = this.signUpForm.get('passwd')?.value || '';
        return v.length >= 8 && v.length <= 30;
    }

    get hasLowerCase() {
        const v = this.signUpForm.get('passwd')?.value || '';
        return /[a-z]/.test(v);
    }

    get hasUpperCase() {
        const v = this.signUpForm.get('passwd')?.value || '';
        return /[A-Z]/.test(v);
    }

    get hasSpecialChar() {
        const v = this.signUpForm.get('passwd')?.value || '';
        return /[!@#$%^&*?]/.test(v);
    }


    get accountValue() {
        return this.signUpForm.get('accountName')?.value || '';
    }

    get accountLengthValid() {
        const len = this.accountValue.length;
        return len >= 6 && len <= 50;
    }

    get accountCharValid() {
        return /^[A-Za-z0-9@_.]*$/.test(this.accountValue);
    }

    get accountNoAccent() {
        return !/[À-ỹ]/.test(this.accountValue);
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
        this.actionKey = "REG" + random(100) + "" + new Date().getMilliseconds();

        this.signUpForm.get('accountName')?.valueChanges.subscribe((val) => {
            this.convertTLowerCase()
        });
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
            email: new FormControl(null, [Validators.required, emailValidator()]),
            mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            passwd: new FormControl(null, [Validators.required]),
            codePresenter: new FormControl(null),
            codeStaff: new FormControl(null),
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
                actionKey: this.actionKey,
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
                        this.sendOtp('USER_REGISTER', 'Đăng ký thành công');
                    } else {
                        this.showError(response.message);
                    }
                    // Re-enable the form
                    this.signUpForm.enable();
                },
                (error) => {

                    console.log(error)
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

    sendOtp(otpType: string, message: string): void {
        const dialogRef = this._dialog.open(OtpSmsConfirmComponent, {
            // width: '450px',
            data: {
                service: this._authService,
                payload: {
                    otpType: otpType,
                    actionKey: this.actionKey
                },
                title: 'Nhận mã xác thực',
                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                complete: () => {
                    this._router.navigateByUrl('sign-in');
                    this._fuseAlertService.showMessageSuccessAuth(message)
                    dialogRef.close();
                },
                autoCloseOnTimeout: true
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
        const control = this.signUpForm.get('accountName');
        const value = control?.value?.toString() || '';
        const lower = value.toLowerCase();

        if (value !== lower) {
            control.patchValue(lower, { emitEvent: false }); // tránh kích hoạt vòng lặp
        }
    }


    public getErrorKey(key: string): string {
        if (this.signUpForm.get(key)?.hasError('required')) {
            return 'DKTK006';
        }

        if (this.signUpForm.get(key)?.hasError('forbiddenUserName') ||
            this.signUpForm.get(key)?.hasError('minlength') ||
            this.signUpForm.get(key)?.hasError('maxlength')) {
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
