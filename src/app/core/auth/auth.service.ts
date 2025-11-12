import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/services/common/http.service';
import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import modeEcb from 'crypto-js/mode-ecb';
import padPkcs7 from 'crypto-js/pad-pkcs7';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AdmAccountDetailDTO, FsDocuments } from "../../models/admin";
import { FileService } from "../../service/common-service";
import { FuseAlertService } from '@fuse/components/alert';
import { AccountDetailStatus } from 'app/enum';
import { CookieService } from './cookie.service';
import { DialogService } from 'app/service/common-service/dialog.service';


@Injectable()
export class AuthService extends HttpService {
    private _authenticated: boolean = false;
    public avatar: BehaviorSubject<string> = new BehaviorSubject(null);
    public authenticated: BehaviorSubject<Boolean> = new BehaviorSubject(false);
    public userChanged$: BehaviorSubject<any> = new BehaviorSubject(null);
    private refreshTimeout: any;

    private _accessTokenKey = 'access_token';
    private _refreshTokenKey = 'refresh_token';
    private _userInfoKey = 'userInfo';
    private _avatarKey = 'avatar';
    private _usernameKey = 'username';
    private _expireTimeKey = 'access_token_expire_time';
    private _expireTime = 120; //thời gian trước khi gọi token


    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _fileService: FileService,
        private _router: Router,
        private _alert: FuseAlertService,
        private _cookieService: CookieService,
        private _dialogService: DialogService
    ) {
        super(_httpClient);
    }


    // Getter & Setter cho expireTime (thời điểm hết hạn tính bằng timestamp ms)
    get expireTime(): number {
        const stored = localStorage.getItem(this._expireTimeKey);
        return stored ? Number(stored) : 0;
    }

    set expireTime(value: number) {
        if (value) {
            localStorage.setItem(this._expireTimeKey, value.toString());
        } else {
            localStorage.removeItem(this._expireTimeKey);
        }
    }
    get isAuthenticated(): Observable<Boolean> {
        return this.authenticated.asObservable();
    }


    setAuthenticated(v) {
        this.authenticated.next(v)
    }

    // Setter & Getter cho userInfo
    set authenticatedUser(userInfo: any) {
        if (userInfo) {
            localStorage.setItem(this._userInfoKey, JSON.stringify(userInfo));
            this.userChanged$.next(userInfo);
        } else {
            localStorage.removeItem(this._userInfoKey);
            this.userChanged$.next(null);
        }
    }

    get authenticatedUser(): any {
        const user = localStorage.getItem(this._userInfoKey);
        // return user;
        return user ? JSON.parse(user) : null;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    get accessToken(): string {
        return this._cookieService.getCookie(this._accessTokenKey) || '';
    }

    set accessToken(token: string) {
        if (token) {
            // Lưu access token trong cookies với thời gian hết hạn 1 ngày
            // Sử dụng secure=false cho localhost, production nên set true
            const isProduction = window.location.protocol === 'https:';
            this._cookieService.setCookie(
                this._accessTokenKey,
                token,
                1, // 1 ngày
                '/',
                isProduction, // Chỉ bật Secure trong production (HTTPS)
                'Strict'
            );
        } else {
            this._cookieService.deleteCookie(this._accessTokenKey);
        }
    }

    get refreshToken(): string {
        return this._cookieService.getCookie(this._refreshTokenKey) || '';
    }

    set refreshToken(token: string) {
        if (token) {
            // Lưu refresh token trong cookies với thời gian hết hạn 7 ngày
            const isProduction = window.location.protocol === 'https:';
            this._cookieService.setCookie(
                this._refreshTokenKey,
                token,
                7, // 7 ngày
                '/',
                isProduction, // Chỉ bật Secure trong production (HTTPS)
                'Strict'
            );
        } else {
            this._cookieService.deleteCookie(this._refreshTokenKey);
        }
    }


    // Setter & Getter cho username ghi nhớ
    set rememberedUsername(username: string) {
        if (username) {
            localStorage.setItem(this._usernameKey, username);
        } else {
            localStorage.removeItem(this._usernameKey);
        }
    }

    get rememberedUsername(): string {
        return localStorage.getItem(this._usernameKey) || '';
    }


    // Xóa toàn bộ thông tin đăng nhập
    clearAuthData(): void {
        // Xóa tokens từ cookies
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        this._cookieService.deleteCookie(this._accessTokenKey);
        this._cookieService.deleteCookie(this._refreshTokenKey);

        // Xóa các thông tin khác từ localStorage
        localStorage.removeItem(this._userInfoKey);
        localStorage.removeItem(this._expireTimeKey);
        localStorage.removeItem(this._avatarKey);
        // localStorage.removeItem(this._usernameKey);
        this._authenticated = false;
        this.userChanged$.next(null);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    loadAvataLocal(): void {
        let avatar = localStorage.getItem(this._avatarKey);
        if (avatar) {
            this.avatar.next(avatar);
        }
    }

    setAvata(avatar: string): void {
        this.avatar.next(avatar);
    }

    get getAvata(): Observable<string> {
        return this.avatar.asObservable();
    }

    /**
     * Forgot password
     *
     * @param user
     */
    forgotPassword(user: {
        payload: {
            accountName: string;
            email: string;
        };
    }): Observable<any> {
        return this._httpClient.post(environment.forgotPasswordUrl, user);
    }

    scheduleTokenRefresh(expiresInSeconds: number): void {
        if (!expiresInSeconds) return;

        // Xóa timer cũ nếu có
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        // Giảm 1–2 phút để refresh sớm hơn
        const refreshBefore = Math.max((expiresInSeconds - this._expireTime), 0) * 1000;
        this.refreshTimeout = setTimeout(() => {
            const currentRefreshToken = this.refreshToken;
            if (currentRefreshToken) {
                this.refreshAccessToken(currentRefreshToken).subscribe({
                    next: (res) => {
                        // if (res?.access_token && res?.expires_in) {
                        //     this.scheduleTokenRefresh(res.expires_in); // Lên lịch lại
                        // }
                    },
                    error: (err) => {
                        console.error('⚠️ Refresh token failed:', err);
                        this.signOut(false).subscribe();
                    }
                });
            }
        }, refreshBefore);
    }

    refreshAccessToken(refreshToken: string): Observable<any> {
        // Sử dụng URLSearchParams thay vì FormData để tránh multipart/form-data
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(environment.clientId + ':' + environment.clientSecret)
        });

        return this._httpClient.post(`${environment.refreshTokenUrl}`, body.toString(), { headers })
            .pipe(
                tap((response: any) => {
                    if (response.access_token) {
                        // ✅ Lưu lại token mới
                        this.accessToken = response.access_token;
                        this.refreshToken = response.refresh_token || this.refreshToken;
                        // this.authenticatedUser = response.userInfo || this.authenticatedUser;

                        // ✅ Cập nhật expireTime & lên lịch mới
                        if (response.expires_in) {
                            this.expireTime = Date.now() + response.expires_in * 1000;
                            this.scheduleTokenRefresh(response.expires_in);
                        }
                    }
                })
            );
    }

    /**
     * Sign out
     */
    signOut(confirm: boolean = true): Observable<any> {
        if (confirm) {
            // ✅ Trường hợp cần xác nhận
            const dialogRef = this._dialogService.openConfirmDialog('Xác nhận đăng xuất tài khoản ra khỏi thiết bị');

            return dialogRef.afterClosed().pipe(
                switchMap((result) => {
                    if (result !== 'confirmed') {
                        // Người dùng hủy
                        return of(false);
                    }
                    // Gọi lại chính hàm signOut nhưng không cần confirm nữa
                    return this.signOut(false);
                })
            );
        }

        // ✅ Trường hợp KHÔNG cần xác nhận (chạy trực tiếp logout)
        if (!this.accessToken) {
            this.clearAuthData();
            this._authenticated = false;
            this.setAvata(null);
            this._router.navigate(['sign-in']);
            return of(true);
        }

        // Gọi API revoke token
        return this._httpClient.post(environment.logoutUrl, {}).pipe(
            tap(() => {
                this.clearAuthData();
                this._authenticated = false;
                this.setAvata(null);
                this._router.navigate(['sign-in']);
            }),
            catchError((error) => {
                console.error('Revoke token error:', error);
                this.clearAuthData();
                this._authenticated = false;
                this.setAvata(null);
                this._router.navigate(['sign-in']);
                return of(false);
            })
        );
    }

    signOutMaintenance(): Observable<any> {
        if (!this.accessToken) {
            this.clearAuthData();
            this._authenticated = false;
            this.setAvata(null);
            this._router.navigate(['maintenance']);
            return of(true);
        }

        // Gọi API revoke token
        return this._httpClient.post(environment.logoutUrl, {}).pipe(
            tap(() => {
                this.clearAuthData();
                this._authenticated = false;
                this.setAvata(null);
                this._router.navigate(['maintenance']);
            }),
            catchError((error) => {
                console.error('Revoke token error:', error);
                this.clearAuthData();
                this._authenticated = false;
                this.setAvata(null);
                this._router.navigate(['maintenance']);
                return of(false);
            })
        );
    }
    signOutError(): Observable<any> {
        if (!this.authenticatedUser) {
            // Nếu chưa có userInfo thì chỉ chuyển trang
            this._router.navigate(['error']);
            return of(true);
        }

        // Nếu có thì clear localStorage
        this.clearAuthData();

        // Set lại authenticated
        this._authenticated = false;

        // Chuyển trang
        this._router.navigate(['error']);

        return of(true);
    }


    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        payload: {
            actionKey: string,
            accountName: string;
            passwd: string;
            type: string;
            codePresenter: string;
            codeStaff: string;
            admAccountDetailDTO: {
                email: string;
                mobile: string;
                type: string;
            };
        };
    }): Observable<any> {
        return this._httpClient.post(environment.registerUrl, user);
    }


    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }

        // Không có token
        if (!this.accessToken || !this.refreshToken) {
            return of(false);
        }

        // Có token -> xác nhận đăng nhập
        this._authenticated = true;

        // 🔹 Nếu còn hạn thì tính thời gian còn lại để đặt lại timer
        const now = Date.now();
        const remainSeconds = Math.max((this.expireTime - now) / 1000, 0);

        if (remainSeconds > this._expireTime) {
            this.scheduleTokenRefresh(remainSeconds);
        } else if (remainSeconds > 0) {
            // Nếu sắp hết hạn thì refresh ngay
            this.refreshAccessToken(this.refreshToken).subscribe();
        }

        return of(true);
    }


    verifyOtp(user: { payload: { userName: string; smsOtp?: string; mailOtp?: string } }): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'register/verify', user);
    }


    resendOtp(user: { payload: { userName: string; smsOtp?: 'resend'; mailOtp?: 'resend' } }): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'register/verify/resend', user);
    }

    forgotPasswordVerifyToken(token): Observable<any> {
        return this._httpClient.post(environment.forgotPasswordVerifyTokenUrl, { payload: { token: token } });
    }

    updateNewPassword(token: string, password: string, confirmPassword: string): Observable<any> {
        password = this.encrypt(password);
        confirmPassword = this.encrypt(confirmPassword);
        return this._httpClient.post(environment.updateNewPassword, { payload: { token: token, password: password, confirmPassword: confirmPassword } });
    }

    encrypt(plaintText): string {
        const enc = aes.encrypt(plaintText, encUtf8.parse(environment.encryptKey), {
            mode: modeEcb,
            padding: padPkcs7,
        });
        return enc.toString();
    }


    // ==================================================
    // 🔹 Login
    // ==================================================
    login(username: string, password: string): Observable<any> {
        const formData = new FormData();
        formData.set('username', username);
        formData.set('password', password);

        const options = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + btoa(environment.clientId + ':' + environment.clientSecret),
            }),
        };

        return this._httpClient.post(environment.loginUrl, formData, options).pipe(
            switchMap((response: any) => {
                if (!response.userInfo) {
                    this._alert.showMessageError('DNTK009'); // đăng nhập thất bại
                    return of(null);
                }

                // ✅ Lưu thông tin đăng nhập
                this._authenticated = true;
                this.accessToken = response.access_token;
                this.refreshToken = response.refresh_token;
                this.authenticatedUser = response.userInfo;
                if (response.expires_in) {
                    this.expireTime = Date.now() + response.expires_in * 1000;
                    this.scheduleTokenRefresh(response.expires_in);
                }

                return of(response);
            }),
            tap((response: any) => {
                if (response?.userInfo) {
                    this.userChanged$.next(response.userInfo);
                    this._alert.showMessageSuccess('DNTK008');
                    this.handleRedirect(response.userInfo);
                }
            }),
            catchError(err => of(err))
        );
    }

    loadAvatar(avatar: string): void {
        if (avatar) {
            this._fileService.getFileFromServer(avatar).pipe(
                tap((res: any) => {
                    if (res?.payload?.contentBase64) {
                        try {
                            // Thử lưu vào localStorage
                            localStorage.setItem(this._avatarKey, res.payload.contentBase64);
                            this.setAvata(res.payload.contentBase64);
                        } catch (err) {
                            // ❌ Nếu vượt dung lượng -> fallback qua BehaviorSubject
                            console.warn('⚠️ Không thể lưu avatar vào localStorage (quota exceeded). Dùng tạm trong bộ nhớ.');
                            this.setAvata(res.payload.contentBase64);
                        }
                    }
                })
            ).subscribe();
        }
    }

    // Lấy avatar từ localStorage khi khởi tạo
    loadAvatarFromLocalStorage(): void {
        const avatarBase64 = localStorage.getItem(this._avatarKey);
        if (avatarBase64) {
            this.setAvata(avatarBase64);
        }
    }

    // ==================================================
    // 🔹 Điều hướng sau đăng nhập
    // ==================================================
    private handleRedirect(userInfo: any): void {
        const { accountType, status } = userInfo;

        if (accountType === 3) {
            this._router.navigateByUrl('page/home');
            return;
        }

        if (accountType === 1) {
            if (status === AccountDetailStatus.WAIT_CONFIRM) {
                this._router.navigateByUrl('investor/kyc');
            } else if (status === AccountDetailStatus.WAIT_APPROVE) {
                this._router.navigateByUrl('investor/kyc-success');
            } else if (status === AccountDetailStatus.ACTIVE) {
                this._router.navigateByUrl('page/home');
            }
            return;
        }

        if (accountType === 2) {
            if (status === 0) {
                this._router.navigateByUrl('borrower/kyc');
            } else if (status === AccountDetailStatus.WAIT_APPROVE) {
                this._router.navigateByUrl('borrower/kyc-success');
            } else if (status === AccountDetailStatus.ACTIVE) {
                this._router.navigateByUrl('page/home');
            }
        }
    }

    /**
     * downloadContract
     *
     */
    downloadRulesDoc():
        Observable<{ payload: any }> {
        return this._httpClient.post(environment.registerUrl + '/downloadServiceProviderDoc', { payload: '' }) as Observable<{ payload: FsDocuments }>;
    }
    /**
     * downloadSecurityDoc
     *
     */
    downloadSecurityDoc():
        Observable<{ payload: any }> {
        return this._httpClient.post(environment.registerUrl + '/downloadInformationSecurityDoc', { payload: '' }) as Observable<{ payload: FsDocuments }>;
    }

    afterUpdateAccountDetail(payload: AdmAccountDetailDTO): void {
        localStorage.setItem(this._userInfoKey, JSON.stringify(Object.assign(this.authenticatedUser, payload)))
        if (payload?.avatar) {
            // this._fileService.getFileFromServer(this.authenticatedUser?.avatar).subscribe(res => {
            //     if (res && res.payload && res.payload.contentBase64) {
            //         localStorage.setItem(this._avatarKey, res.payload.contentBase64);
            //         this.setAvata(res.payload.contentBase64);
            //     }
            // })
            this.loadAvatar(payload?.avatar)
        } else {
            localStorage.removeItem(this._avatarKey)
            this.setAvata(null);
        }
    }
}
