import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import { ActionAuditInvestorComponent } from './investor/action-audit-investor.component';
import { ActionAuditStaffComponent } from './staff/action-audit-staff.component';
import {
    AccessLogInvestorResolver, AccessLogLenderResolver,
     AccessLogStaffResolver
} from './action-audit.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ActionAuditComponent} from './action-audit.component';
import {AsyncPipe, CommonModule, NgIf, NgStyle} from '@angular/common';
import {DetailActionAuditComponent} from "./detail-action-audit/detail-action-audit.component";
import {ActionAuditLenderComponent} from "./lender/action-audit-lender.component";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        component: ActionAuditComponent,
        children: [
            {
                path: 'staff',
                component: ActionAuditStaffComponent,
                resolve: {
                    investedProfileRoutes: AccessLogStaffResolver,
                },
            },
            {
                path: 'investor',
                component: ActionAuditInvestorComponent,
                resolve: {
                    investedProfileRoutes: AccessLogInvestorResolver,
                },
            },
            {
                path: 'lender',
                component: ActionAuditLenderComponent,
                resolve: {
                    investedProfileRoutes: AccessLogLenderResolver,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        ActionAuditComponent,
        ActionAuditInvestorComponent,
        ActionAuditStaffComponent,
        ActionAuditLenderComponent,
        DetailActionAuditComponent,
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
        TranslocoModule,
        MatTableModule,
        MatPaginatorModule,
    ]
})
export class ActionAuditModule
{
}
