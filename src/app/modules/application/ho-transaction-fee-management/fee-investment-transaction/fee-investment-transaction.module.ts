import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../../@fuse/components/navigation';
import {
    InvestmentTransactionFeeResolver, InvestmentTransactionFeeReqResolver
} from '../transaction-fee-management.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FeeInvestmentTransactionListComponent} from './list-base/fee-investment-transaction-list.component';
import {FeeInvestmentTransactionRequestComponent} from './list-request/fee-investment-transaction-request.component';
import {FeeInvestmentTransactionDetailComponent} from "./list-request/detail/fee-investment-transaction-detail.component";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {FeeInvestmentTransactionDialogComponent} from "./list-base/create-dialog/fee-investment-transaction-dialog.component";
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
                data: { title: 'Danh sách phí kết nối đầu tư' },
                path: 'list',
                component: FeeInvestmentTransactionListComponent,
                resolve: {
                    error: InvestmentTransactionFeeResolver,
                },
            },
            {
                data: { title: 'Yêu cầu phí kết nối đầu tư' },
                path: 'request',
                component: FeeInvestmentTransactionRequestComponent,
                resolve: {
                    error: InvestmentTransactionFeeReqResolver,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        FeeInvestmentTransactionListComponent,
        FeeInvestmentTransactionRequestComponent,
        FeeInvestmentTransactionDetailComponent,
        FeeInvestmentTransactionDialogComponent
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
export class FeeInvestmentTransactionModule
{
}
