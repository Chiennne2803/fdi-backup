import { Component,  OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';
import { AccountDetailStatus } from "../../../enum";
import { AccountService } from "../../../service/common-service/account.service";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { FileService } from "../../../service/common-service";

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _authMockApi: AuthMockApi,
        private _fuseAlertService: FuseAlertService,
        private afMessaging: AngularFireMessaging,
        private _fileService: FileService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username: new FormControl(localStorage.getItem('username') || null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
            rememberMe: new FormControl(false),
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        const key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
        const pwAES = CryptoJS.MD5(this.signInForm.get('password').value.toString().trim()).toString();

        const usernameAES = CryptoJS.AES.encrypt(this.signInForm.get('username').value.toString().trim(), key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        // Disable the form
        this.signInForm.disable();

        this._authService.login(usernameAES, pwAES).subscribe((response) => {
            if (response.userInfo != null) {
                this._authService.setAuthenticated(true)
                this._authService.accessToken = response.access_token;
                localStorage.setItem('userInfo', JSON.stringify(response.userInfo));
                const accessToken = this._authMockApi._generateJWTToken();
                localStorage.setItem('accessToken', accessToken);
                this._fuseAlertService.showMessageSuccess('DNTK008');

                this.afMessaging.getToken.subscribe((token) => {
                    console.log("Gửi token FCM đến máy chủ")
                    console.log(token)
                    // Gửi token FCM đến máy chủ của bạn
                    this._accountService.updateDeviceId({ deviceId: token }).subscribe(res2 => console.log(res2));
                });
                this.afMessaging.messages.subscribe((message: any) => {
                    this._fuseAlertService.showMessageSuccess(message)
                });

                // routing to admin
                if (response.userInfo.accountType === 3) {
                    // this._router.navigateByUrl('admin/dashboard');
                    this._router.navigateByUrl('page/home');

                }

                // routing to investor
                if (response.userInfo.accountType === 1) {
                    if (response.userInfo.status === AccountDetailStatus.WAIT_CONFIRM) {
                        this._router.navigateByUrl('investor/kyc');
                        // this._router.navigateByUrl('page/home');
                    } else if (response.userInfo.status === AccountDetailStatus.WAIT_APPROVE) {
                        this._router.navigateByUrl('investor/kyc-success');
                        // this._router.navigateByUrl('page/home');

                    } else if (response.userInfo.status === AccountDetailStatus.ACTIVE) {
                        // this._router.navigateByUrl('investor/dashboard');
                         this._router.navigateByUrl('page/home');
                    }
                }

                // routing to borrower
                if (response.userInfo.accountType === 2) {
                    if (response.userInfo.status === 0) {
                        this._router.navigateByUrl('borrower/kyc');
                        //  this._router.navigateByUrl('page/home');
                    } else if (response.userInfo.status === AccountDetailStatus.WAIT_APPROVE) {
                        this._router.navigateByUrl('borrower/kyc-success');
                        //  this._router.navigateByUrl('page/home');
                    } else if (response.userInfo.status === AccountDetailStatus.ACTIVE) {
                        // this._router.navigateByUrl('borrower/dashboard');
                         this._router.navigateByUrl('page/home');
                    }
                }

                if (this.signInForm.value.rememberMe) {
                    localStorage.setItem('username', response.userInfo.accountName);
                }
                localStorage.removeItem('avatar');
                if (response.userInfo.avatar) {
                    this._fileService.getFileFromServer(response.userInfo.avatar).subscribe(res => {
                        if (res && res.payload && res.payload.contentBase64) {
                            localStorage.setItem('avatar', res.payload.contentBase64);
                            this._authService.setAvata(res.payload.contentBase64);
                        }
                    })
                }
            } else {
                this.showAlert = true;
                this.alert.message = response?.error?.errorCode;
                this.alert.type = 'error';
                this.signInForm.enable();
            }
        });

    }
}
