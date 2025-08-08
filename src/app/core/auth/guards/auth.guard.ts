import {Injectable} from '@angular/core';
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
import {AuthService} from 'app/core/auth/auth.service';
import {Observable, of, switchMap} from 'rxjs';
import {AdmAccountType} from "../../user/user.types";

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
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
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
        // Check the authentication status
        return this._authService.check()
            .pipe(
                switchMap((authenticated) => {

                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the sign-in page
                        this._router.navigate(['sign-in'], {queryParams: {returnUrl: redirectURL}});

                        // Prevent the access
                        return of(false);
                    } else if (this._authService.authenticatedUser) {
                        if (this._authService.authenticatedUser.status === 0) {
                            //to kyc
                            return of(true);
                        }
                        if (this._authService.authenticatedUser.status === 1
                            && (!redirectURL.startsWith('/borrower/kyc-success') && !redirectURL.startsWith('/investor/kyc-success') && !redirectURL.startsWith('/kyc-success'))) {
                            this._router.navigate([this._authService.authenticatedUser.accountType === 1 ? 'investor/kyc-success' : 'borrower/kyc-success']);
                            return of(true);
                        }
                    }

                    // Allow the access
                    return of(true);
                })
            );
    }
}
