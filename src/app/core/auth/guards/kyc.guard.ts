import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ROUTER_CONST } from '../../../shared/constants';
import { UserAccountStatus } from '../../user/user.types';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class KycGuard implements CanActivateChild {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const parentRoute = ROUTER_CONST.config.kyc.parent.find(p => state.url.includes(p.link));
        const isKycUrl = childRoute.routeConfig.path === parentRoute.pathKyc;

        switch (this._authService.authenticatedUser.status) {
            case UserAccountStatus.MUST_KYC:
                if (state.url === parentRoute.linkKyc) {
                    return of(true);
                }

                if (!isKycUrl) {
                    return this._router.parseUrl(parentRoute.linkKyc);
                }

                break;
            case UserAccountStatus.WAS_KYC:
                if (isKycUrl) {
                    return this._router.parseUrl(parentRoute.link);
                }
                break;
        }

        return of(true);
    }
}
