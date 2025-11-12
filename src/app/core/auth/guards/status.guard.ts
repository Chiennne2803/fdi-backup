import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserAccountStatus } from 'app/core/user/user.types';

@Injectable({
  providedIn: 'root'
})
export class StatusGuard implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): boolean {
    return this.checkStatus();
  }

  canActivateChild(): boolean {
    return this.checkStatus();
  }

  private checkStatus(): boolean {
    const user = this._authService.authenticatedUser;

    if (!user) {
      this._router.navigateByUrl('/sign-in');
      return false;
    }

    if (user.status === UserAccountStatus.MUST_KYC || user.status === UserAccountStatus.MUST_KYC) {
      // Điều hướng người dùng tới trang phù hợp
      this._router.navigateByUrl('/admin');
      return false;
    } 

    return true;
  }
}
