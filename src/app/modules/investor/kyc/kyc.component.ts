import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-investor-kyc',
    templateUrl: './kyc.component.html',
    styleUrls: ['./kyc.component.scss']
})
export class InvestorKYCComponent implements OnInit {
    isKycStarted: boolean = true;
    isKycFinished: boolean = false;
    isKycContactCustomerService: boolean = false;
    constructor(
    ) { }

    ngOnInit(): void { }
}
