import { Component } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'kyc-finised',
    templateUrl: './kyc-finish.component.html'
})
export class KycFinishComponent {
    constructor(
        private _authService: AuthService
    ) {
    }

    signOut(): void {
        this._authService.signOut(true).subscribe()
    }
}
