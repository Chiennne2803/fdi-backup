import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { AdmAccountType } from 'app/core/user/user.types';
import { ROUTER_CONST } from 'app/shared/constants';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
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
        if (this._authService.authenticatedUser.accountType === route.data.role) {
            return of(true);
        }
        switch (this._authService.authenticatedUser.accountType) {
            case AdmAccountType.ADMIN: this._router.navigate([ROUTER_CONST.config.admin.root]); break;
            case AdmAccountType.INVESTOR: this._router.navigate([ROUTER_CONST.config.investor.root]); break;
            case AdmAccountType.BORROWER: this._router.navigate([ROUTER_CONST.config.borrower.root]); break;
        }

        return of(false);
    }
}
