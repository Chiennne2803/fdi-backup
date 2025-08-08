import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {Injectable} from '@angular/core';
import {UserService} from 'app/core/user/user.service';
import {HttpService} from 'app/shared/services/common/http.service';
import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import modeEcb from 'crypto-js/mode-ecb';
import padPkcs7 from 'crypto-js/pad-pkcs7';
import {environment} from 'environments/environment';
import {BehaviorSubject, catchError, map, Observable, of, switchMap} from 'rxjs';
import {AdmAccountType, User} from '../user/user.types';
import {Router} from '@angular/router';
import {AdmAccountDetailDTO, FsDocuments, UserAvatarMap} from "../../models/admin";
import {FileService} from "../../service/common-service";
import {BaseResponse} from "../../models/base";


@Injectable()
export class AuthService extends HttpService{
    private _authenticated: boolean = false;
    public avatar: BehaviorSubject<string> = new BehaviorSubject(null);
    private ADMIN_AVATAR: string = 'assets/images/images/canhanvayvon.svg'

    public authenticated: BehaviorSubject<Boolean> = new BehaviorSubject(false);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _fileService: FileService,
        private _router: Router,
        private _fuseAlertService: FuseAlertService,
    ) {
        super(_httpClient);
    }

    get isAuthenticated(): Observable<Boolean> {
        return this.authenticated.asObservable();
    }

    setAuthenticated(v) {
        this.authenticated.next(v)
    }

    get authenticatedUser(): User {
        return JSON.parse(localStorage.getItem('userInfo')) ?? null;

    }

    get jwtToken(): string {
        return localStorage.getItem('jwt') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    get accessToken(): string {
        return localStorage.getItem('jwt') || '';
    }

    set accessToken(token: string) {
        localStorage.setItem('jwt', token);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    loadAvataLocal(): void {
        let avatar = localStorage.getItem('avatar');
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

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return of(new Error('User is already logged in.'));
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(force: boolean = false): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('jwt');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('avatar');

        // Set the authenticated flag to false
        this._authenticated = false;
        this._router.navigate(['sign-in']);
        /*if (force) {
            this._fuseAlertService.showMessageError('Hết hạn đăng nhập');
        }*/

        // Return the observable
        return of(true);
        this.authenticated.next(false)
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        payload: {
            actionKey : string,
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
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    verifyOtp(user: { payload: { userName: string; smsOtp?: string; mailOtp?: string } }): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'register/verify', user);
    }


    resendOtp(user: { payload: { userName: string; smsOtp?: 'resend'; mailOtp?: 'resend' } }): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'register/verify/resend', user);
    }

    // verifySmsOtp(user: { payload: { userName: string; smsOtp: string } }): Observable<any> {
    //     return this._httpClient.post(environment.forgotPasswordVerifyOtpUrl, user);
    // }

    // resendSmsOtp(user: { payload: { userName: string } }): Observable<any> {
    //     return this._httpClient.post(environment.forgotPasswordResendOtpUrl, user);
    // }

    forgotPasswordVerifyToken(token): Observable<any> {
        return this._httpClient.post(environment.forgotPasswordVerifyTokenUrl, { payload: { token: token } });
    }

    updateNewPassword(token, password, confirmPassword): Observable<any> {
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


    login(username: string, password: string): Observable<any> {
        const formData: any = new FormData();
        formData.set('username', username);
        formData.set('password', password);

        const options = {
            headers: new HttpHeaders({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': 'Basic ' + btoa(environment.clientId + ":" + environment.clientSecret),
            }),
        };


        return this._httpClient.post(environment.loginUrl, formData, options).pipe(
            map(res => res),
            catchError(err => of(err))
        );
    }

    /**
     * downloadContract
     *
     */
    downloadRulesDoc():
        Observable<{ payload: any }> {
        return this._httpClient.post(environment.registerUrl +'/downloadServiceProviderDoc', {payload: ''}) as Observable<{ payload: FsDocuments }>;
    }
    /**
     * downloadSecurityDoc
     *
     */
    downloadSecurityDoc():
        Observable<{ payload: any }> {
        return this._httpClient.post(environment.registerUrl +'/downloadInformationSecurityDoc', {payload: ''}) as Observable<{ payload: FsDocuments }>;
    }

    loadDefaultAvatar(): string {
        if(this.authenticatedUser) {
            if(this.authenticatedUser.accountType === AdmAccountType.ADMIN) {
                return this.ADMIN_AVATAR;
            }
            return UserAvatarMap[this.authenticatedUser.type]
        }
        return this.ADMIN_AVATAR;
    }

    afterUpdateAccountDetail(payload: AdmAccountDetailDTO): void {
        localStorage.setItem('userInfo', JSON.stringify(Object.assign(this.authenticatedUser, payload)))
        if (this.authenticatedUser?.avatar) {
            this._fileService.getFileFromServer(this.authenticatedUser?.avatar).subscribe(res => {
                if (res && res.payload && res.payload.contentBase64) {
                    localStorage.setItem('avatar', res.payload.contentBase64);
                    this.setAvata(res.payload.contentBase64);
                }
            })
        }
    }
}
