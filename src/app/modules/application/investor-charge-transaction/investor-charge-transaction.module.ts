import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import { ErrorChargeTransactionComponent } from './error/error-charge-transaction.component';
import { SuccessChargeTransactionComponent } from './success/success-charge-transaction.component';
import {
    ErrorTransaction,
    SuccessTransaction,
} from './investor-charge-transaction.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {InvestorChargeTransactionComponent} from './investor-charge-transaction.component';
import {AsyncPipe, CommonModule, NgIf, NgStyle} from '@angular/common';
import {DetailChargeTransactionComponent} from "./detail-charge-transaction/detail-charge-transaction.component";
import {TranslocoModule} from "@ngneat/transloco";
import { MatIconModule } from '@angular/material/icon';
import { WaitChargeTransactionComponent } from './wait/wait-charge-transaction.component';
import { WaitTransaction } from './investor-charge-tramsaction-topup.resolvers';
import { DetailTopupTransactionComponent } from './detail-wait-topup-transaction/detail-wait-topup-transaction.component';

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        component: InvestorChargeTransactionComponent,
        children: [
            {
                path: '',
                data: { title: 'Giao dịch nạp tiền lỗi' },
                component: ErrorChargeTransactionComponent,
                resolve: {
                    error: ErrorTransaction,
                },
            },
            {
                data: { title: 'Giao dịch nạp tiền thành công' },
                path: 'success',
                component: SuccessChargeTransactionComponent,
                resolve: {
                    success: SuccessTransaction,
                },
            },
            {
                data: { title: 'Giao dịch chờ nạp tiền' },
                path: 'wait',
                component: WaitChargeTransactionComponent,
                resolve: {
                    wait: WaitTransaction,
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
        WaitChargeTransactionComponent,
        DetailChargeTransactionComponent,
        DetailTopupTransactionComponent
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        MatSidenavModule,
        SharedUIModule,
        MatIconModule,
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
