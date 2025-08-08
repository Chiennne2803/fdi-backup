import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../../@fuse/components/navigation';
import {
    DepositTransactionFeeResolver, DepositTransactionFeeReqResolver
} from '../transaction-fee-management.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FeeDepositTransactionListComponent} from './list-base/fee-deposit-transaction-list.component';
import {FeeDepositTransactionRequestComponent} from './list-request/fee-deposit-transaction-request.component';
import {FeeDepositTransactionDetailComponent} from "./list-request/detail/fee-deposit-transaction-detail.component";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {FeeDepositTransactionDialogComponent} from "./list-base/create-dialog/fee-deposit-transaction-dialog.component";
import {SharedModule} from "../../../../shared/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        children: [
            {
                path: 'list',
                component: FeeDepositTransactionListComponent,
                resolve: {
                    error: DepositTransactionFeeResolver,
                },
            },
            {
                path: 'request',
                component: FeeDepositTransactionRequestComponent,
                resolve: {
                    error: DepositTransactionFeeReqResolver,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        FeeDepositTransactionListComponent,
        FeeDepositTransactionRequestComponent,
        FeeDepositTransactionDetailComponent,
        FeeDepositTransactionDialogComponent
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        MatSidenavModule,
        SharedUIModule,
        FuseNavigationModule,
        MatTabsModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
        FuseNavigationModule,
        MatPaginatorModule,
        CurrencyMaskModule,
        TranslocoModule,
    ]
})
export class FeeDepositTransactionModule
{
}
