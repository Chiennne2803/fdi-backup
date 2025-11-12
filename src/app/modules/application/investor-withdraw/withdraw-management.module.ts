import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {WaitingWithdrawComponent} from './waiting/waiting-withdraw.component';
import {WithdrawManagementProcessedResolvers, WithdrawManagementWaitingResolvers} from './withdraw-management.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ProcessedWithdrawComponent} from './processed/processed-withdraw.component';
import {SharedUIModule} from 'app/shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {AsyncPipe, CommonModule, NgIf, NgStyle} from '@angular/common';
import {WithdrawManagementComponent} from './withdraw-management.component';
import {DetailWithdrawComponent} from './detail-withdraw/detail-withdraw.component';
import {FuseAlertModule} from "../../../../@fuse/components/alert";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import { MatIconModule } from '@angular/material/icon';


const withdrawRoutes: Route[] = [
    {
        path     : '',
        component: WithdrawManagementComponent,
        children: [
            {
                data: { title: 'Giao dịch chờ xử lý' },
                path: '',
                component: WaitingWithdrawComponent,
                resolve: {
                    waiting: WithdrawManagementWaitingResolvers,
                },
            },
            {
                data: { title: 'Giao dịch đã xử lý' },
                path: 'processed',
                component: ProcessedWithdrawComponent,
                resolve: {
                    invested: WithdrawManagementProcessedResolvers,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        WaitingWithdrawComponent,
        ProcessedWithdrawComponent,
        WithdrawManagementComponent,
        DetailWithdrawComponent
    ],
    imports: [
        RouterModule.forChild(withdrawRoutes),
        MatSidenavModule,
        SharedUIModule,
        FuseNavigationModule,
        MatTabsModule,
        NgIf,
        MatIconModule,
        AsyncPipe,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        NgStyle,
        CommonModule,
        FuseAlertModule,
        TranslocoModule,
    ]
})
export class WithdrawManagementModule
{
}
