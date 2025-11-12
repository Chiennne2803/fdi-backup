import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';
import { MaintenanceService } from 'app/service';
// import { forbiddenUserNameValidator } from 'app/shared/validator/forbidden';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styles: [
        `
   .promo-text {
  background: linear-gradient(
    106.46deg,
    #2854f2 18.36%,
    #394ee4 27.43%,
    #6641c1 42.73%,
    #ba219d 65.37%,
    #ff6c0e 92.94%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.promo-banner {
  position: relative;
  overflow: hidden;
  background-color: #fff;
}

/* Container chứa 2 đoạn nối liền */
.marquee {
  display: flex;
  width: 200%;
  animation: marquee-scroll 6s linear infinite; /* tốc độ nhanh */
}

/* Hover dừng lại */
// .promo-banner:hover .marquee {
//   animation-play-state: paused;
// }

/* Mỗi phần chiếm 50% */
.marquee__inner {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Chạy liền mạch từ phải qua trái */
@keyframes marquee-scroll {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}
        `
    ],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    maintenanceMessage: string | null = null;

    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    maintenanceEnabled: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private maintenanceService: MaintenanceService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Gọi API kiểm tra bảo trì
        // this.maintenanceService.getMaintenanceConfig().subscribe({
        //     next: (res) => {
        //         if (res.enabled) {
        //             const [startStr, endStr] = res.time.split(',');
        //             const [date, time] = endStr.split('-');
        //             this.maintenanceMessage = `${res.message} <strong>${time}-${date}</strong>`;
        //             this.maintenanceEnabled = true;
        //             this.signInForm.disable();
        //         } else {
        //             this.maintenanceMessage = null;

        //             this.signInForm.enable();
        //         }
        //     },
        //     error: (error) => {
        //         console.error(error);
        //         this.maintenanceMessage = null;
        //         this.signInForm.enable();
        //     }
        // });

        // Tạo form
        // forbiddenUserNameValidator()
        this.signInForm = this._formBuilder.group({
            username: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
            rememberMe: new FormControl(false),
        });

        this.signInForm.get('username')?.valueChanges.subscribe((val) => {
            this.convertTLowerCase()
        });
    }
    convertTLowerCase() {
        const control = this.signInForm.get('username');
        const value = control?.value?.toString() || '';
        const lower = value.toLowerCase();

        if (value !== lower) {
            control.patchValue(lower, { emitEvent: false }); // tránh kích hoạt vòng lặp
        }
    }
    public getErrorKey(key: string): string {
        if (this.signInForm.get(key)?.hasError('required')) {
            return 'DKTK006';
        }

        if (this.signInForm.get(key)?.hasError('forbiddenUserName') ||
            this.signInForm.get(key)?.hasError('minlength') ||
            this.signInForm.get(key)?.hasError('maxlength')) {
            return 'DKTK005';
        }
    }

    onClickPage(route: string): void {
        if (this.maintenanceEnabled) {
            // Nếu đang bảo trì thì chuyển đến trang bảo trì
            this._router.navigate(['/maintenance']);
            return;
        }

        // Nếu không bảo trì thì cho phép điều hướng bình thường
        this._router.navigate([route]);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        if (this.signInForm.invalid) return;

        const key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
        const pwAES = CryptoJS.MD5(this.signInForm.get('password').value.toString().trim()).toString();
        const usernameAES = CryptoJS.AES.encrypt(this.signInForm.get('username').value.toString().trim(), key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        this.signInForm.disable();
        this.showAlert = false;

        this._authService.login(usernameAES, pwAES).subscribe((res) => {
            if (res.userInfo != null) {
                if (this.signInForm.value.rememberMe) {
                    this._authService.rememberedUsername = res.userInfo.accountName;
                } else {
                    this._authService.rememberedUsername = '';
                }
            } else {
                this.showAlert = true;
                this.alert.message = res?.error?.errorCode;
                this.alert.type = 'error';
                this.signInForm.enable();
            }
        });
    }

}
