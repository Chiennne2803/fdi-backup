import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of, switchMap } from 'rxjs';
// import {AdmAccountType} from "../../user/user.types";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-in' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-in' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean> {
        return this._authService.check().pipe(
            switchMap((authenticated) => {
                if (!authenticated) {
                    this._router.navigate(['sign-in'], { queryParams: { returnUrl: redirectURL } });
                    return of(false);
                }

                const user = this._authService.authenticatedUser;

                // 👇 THÊM KIỂM TRA NÀY
                if (!user) {
                    this._authService.signOut(false).subscribe();
                    return of(false);
                }

                // Nếu chưa KYC (status = 0)
                if (user.status === 0) {
                    return of(true);
                }

                // Nếu đang chờ duyệt KYC (status = 1)
                if (user.status === 1) {
                    const successUrl =
                        user.accountType === 1 ? '/investor/kyc-success' : '/borrower/kyc-success';
                    if (!redirectURL.startsWith(successUrl)) {
                        this._router.navigate([successUrl]);
                        return of(false);
                    }
                    return of(true);
                }

                // Nếu đã duyệt KYC hoặc trạng thái khác
                return of(true);
            })
        );
    }

}
