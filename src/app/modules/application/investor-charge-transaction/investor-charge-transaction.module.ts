import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import { ErrorChargeTransactionComponent } from './error/error-charge-transaction.component';
import { SuccessChargeTransactionComponent } from './success/success-charge-transaction.component';
import {
    ErrorTransaction,
    SuccessTransaction
} from './investor-charge-transaction.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {InvestorChargeTransactionComponent} from './investor-charge-transaction.component';
import {AsyncPipe, CommonModule, NgIf, NgStyle} from '@angular/common';
import {DetailChargeTransactionComponent} from "./detail-charge-transaction/detail-charge-transaction.component";
import {SharedModule} from "../../../shared/shared.module";
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        component: InvestorChargeTransactionComponent,
        children: [
            {
                path: '',
                component: ErrorChargeTransactionComponent,
                resolve: {
                    error: ErrorTransaction,
                },
            },
            {
                path: 'success',
                component: SuccessChargeTransactionComponent,
                resolve: {
                    success: SuccessTransaction,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        InvestorChargeTransactionComponent,
        ErrorChargeTransactionComponent,
        SuccessChargeTransactionComponent,
        DetailChargeTransactionComponent,
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
        NgIf,
        AsyncPipe,
        NgStyle,
        CommonModule,
        TranslocoModule
    ]
})
export class InvestorChargeTransactionModule
{
}
