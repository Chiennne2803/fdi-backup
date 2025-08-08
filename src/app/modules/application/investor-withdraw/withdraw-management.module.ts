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


const withdrawRoutes: Route[] = [
    {
        path     : '',
        component: WithdrawManagementComponent,
        children: [
            {
                path: '',
                component: WaitingWithdrawComponent,
                resolve: {
                    waiting: WithdrawManagementWaitingResolvers,
                },
            },
            {
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
