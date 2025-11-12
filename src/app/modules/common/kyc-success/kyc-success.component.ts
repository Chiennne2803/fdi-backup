import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'kyc-success',
    templateUrl: './kyc-success.component.html',
    animations: fuseAnimations,
})
export class KycSuccessComponent  {
    constructor(
        private _authService: AuthService
    ) {
    }
    signOut(): void {
        this._authService.signOut(true).subscribe()
    }
}
