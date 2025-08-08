import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { forbiddenPasswordValidator } from 'app/shared/validator/forbidden';
import {ActivatedRoute} from '@angular/router';
import {ModalNotifyComponent} from 'app/shared/components/modal-notify/modal-notify.component';
import {MatDialog} from '@angular/material/dialog';
import {APP_TEXT} from 'app/shared/constants';

@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    public appText = APP_TEXT;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    token: string;
    redirectUrl: string;
    message: string;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private dialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', [
                    Validators.required,
                    forbiddenPasswordValidator()
                ]],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );

        this.token = this.route.snapshot.paramMap.get('token');
        this.checkToken();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    checkToken(): void {
        this._authService.forgotPasswordVerifyToken(this.token)
            .subscribe(
                (response) => {
                    if (response.errorCode !== '0') {
                        this.openDialog('sign-in', this.appText.redirectType.button, response.message);
                    }
                },
                (response) => {
                    this.openDialog('sign-in', this.appText.redirectType.button, response.message);
                }
            );
    }

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService.updateNewPassword(this.token, this.resetPasswordForm.value.password, this.resetPasswordForm.value.passwordConfirm)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();
                })
            )
            .subscribe(
                (response) => {
                    if (response.errorCode === '0') {
                        this.openDialog('sign-in', this.appText.redirectType.text, 'Mật khẩu của bạn đã được thay đổi thành công.');
                    } else {
                        // Show the alert
                        this.showAlert = true;

                        // Set the alert
                        this.alert = {
                            type   : 'error',
                            message: 'Đã xảy ra lỗi. Vui lòng thử lại.'
                        };
                    }
                },
                (response) => {
                    // Show the alert
                    this.showAlert = true;

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Đã xảy ra lỗi. Vui lòng thử lại.'
                    };
                }
            );
    }

    openDialog(redirectUrl, redirectType, message): void {
        const dialogRef = this.dialog.open(ModalNotifyComponent, {
            data: {
                redirectType: redirectType,
                redirectUrl: redirectUrl,
                message: message,
                complete: () => {
                    dialogRef.close();
                },
            },
            disableClose: true
        });
    };
}
