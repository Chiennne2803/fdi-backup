import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommissionManagementComponent } from './commission-management.component';
import { CommissionManagementResolver } from './commission-management.resolver';
import { ListRequestPaymentCommissionComponent } from './components/list-request-payment-commission/list-request-payment-commission.component';
import { ListTransactionComponent } from './components/list-transaction/list-transaction.component';

const route: Route[] = [
    {
        path: '', component: CommissionManagementComponent, resolve: {
            commissionManagement: CommissionManagementResolver,
        }, children: [
            { path: '', pathMatch: 'full', redirectTo: 'transaction' },
            { path: 'transaction',  data: { title: 'Danh sách thanh toán hoa hồng' },component: ListTransactionComponent },
            { path: 'request-payment',  data: { title: 'Yêu cầu thanh toán hoa hồng' }, component: ListRequestPaymentCommissionComponent }
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class CommissionManagementRoutingModule { }
