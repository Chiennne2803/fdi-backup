import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../../../core/auth/auth.service';
import {KycServices} from "../../../../service/kyc";

@Component({
    selector: 'layout-common-kyc-starter',
    templateUrl: './kyc-starter.component.html',
    styleUrls: ['./kyc-starter.component.scss'],
    encapsulation  : ViewEncapsulation.None
})
export class KycStarterComponent {
    @Output() isKycStarted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    @Output() isContactCustomerService: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    constructor(
        private _authService: AuthService,
        private _kycService: KycServices
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onClickStartedBtn(): void {
        this.isKycStarted.emit(true);
    }

    onClickContactCustomerService(): void {
        this.isContactCustomerService.emit(true);
        this._kycService.contactCustomerCare().subscribe();
    }
}
