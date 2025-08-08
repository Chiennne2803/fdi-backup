import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { SharedModule } from 'app/shared/shared.module';
import { CommissionManagementRoutingModule } from './commission-management-routing.module';
import { CommissionManagementComponent } from './commission-management.component';
import { CommissionTransDetailComponent } from './components/commission-trans-detail/commission-trans-detail.component';
import { ListRequestPaymentCommissionComponent } from './components/list-request-payment-commission/list-request-payment-commission.component';
import { ListTransactionComponent } from './components/list-transaction/list-transaction.component';
import { RequestCommissionDialogComponent } from './components/request-commission-dialog/request-commission-dialog.component';
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
    declarations: [
        CommissionManagementComponent,
        ListTransactionComponent,
        ListRequestPaymentCommissionComponent,
        RequestCommissionDialogComponent,
        CommissionTransDetailComponent
    ],
    imports: [
        SharedModule,
        CommissionManagementRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
        FuseNavigationModule,
        CurrencyMaskModule,
        TranslocoModule
    ]
})
export class CommissionManagementModule { }
