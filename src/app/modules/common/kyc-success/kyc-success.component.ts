import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
    selector: 'kyc-success',
    templateUrl: './kyc-success.component.html',
    animations: fuseAnimations,
})
export class KycSuccessComponent implements OnInit {
    constructor(
        private _authService: AuthService
    ) {
    }

    ngOnInit(): void {
    }
}
