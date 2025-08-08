import {Component} from '@angular/core';

@Component({
    selector: 'borrwer-kyc',
    templateUrl: './kyc.component.html'
})
export class BorrowerKycComponent {
    isKycStarted: boolean = true;
    isKycFinished: boolean = false;
    isKycContactCustomerService: boolean = false;

    constructor() { }
}
