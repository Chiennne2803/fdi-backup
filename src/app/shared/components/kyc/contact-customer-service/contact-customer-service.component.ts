import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'kyc-contact-customer-service',
    templateUrl: './contact-customer-service.component.html'
})
export class ContactCustomerServiceComponent {
    @Output() isContactFinished: EventEmitter<boolean> = new EventEmitter<boolean>();

    onClickBackToKyc(): void {
        this.isContactFinished.emit(false);
    }
}
