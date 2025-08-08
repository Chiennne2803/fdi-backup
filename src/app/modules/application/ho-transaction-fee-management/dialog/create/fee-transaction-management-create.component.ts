import {Component} from '@angular/core';
import {AuthService} from 'app/core/auth/auth.service';

@Component({
    selector: 'fee-transaction-management-search-dialog',
    templateUrl: './fee-transaction-management-create.component.html'
})
export class FeeTransactionManagementCreateComponent {
    public currentDate = new Date();
    public date = new Date();
    constructor(
        public authService: AuthService,
    ) {}
}
