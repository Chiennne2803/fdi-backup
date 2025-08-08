import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';
import { AdminComponent } from './admin.component';
import { DashBoardResolvers } from './admin.resolvers';
import {AccessLogStaffResolver} from "./action-audit/action-audit.resolvers";

const router: Route[] = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: ROUTER_CONST.config.admin.dashboard,
                pathMatch: 'full'
            },
            {
                path: 'maintenance',
                loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule),
            },
            {
                path: ROUTER_CONST.config.admin.departments.root,
                loadChildren: () => import('./departments/departments.module').then(m => m.DepartmentsModule),
            },
            {
                path: ROUTER_CONST.config.admin.staff.root,
                loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),
            },
            {
                path: ROUTER_CONST.config.admin.category.root,
                loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
            },
            {
                path: ROUTER_CONST.config.admin.area.root,
                loadChildren: () => import('./area/area.module').then(m => m.AreaModule),
            },
            {
                path: ROUTER_CONST.config.admin.emailConfig.root,
                loadChildren: () => import('./email-config/email-config.module').then(m => m.EmailConfigModule),
            },
            {
                path: ROUTER_CONST.config.admin.creditModifier.root,
                loadChildren: () => import('./credit-modifier/credit-modifier.module').then(m => m.CreditModifierModule),
            },
            {
                path: ROUTER_CONST.config.admin.bankAccounts.root,
                loadChildren: () => import('./bank-account/bank-account.module').then(m => m.BankAccountModule),
            },
            {
                path: ROUTER_CONST.config.admin.documentConfig.root,
                loadChildren: () => import('./document-config/document-config.module').then(m => m.DocumentConfigModule),
            },
            {
                path: ROUTER_CONST.config.admin.notificationConfig.root,
                loadChildren: () => import('./setting-notification/setting-notification.module').then(m => m.SettingNotificationModule)
            },
            {
                path: ROUTER_CONST.config.admin.accessLogs.root,
                // loadChildren: () => import('./action-audit/action-audit.module').then(m => m.ActionAuditModule),
                loadChildren: () => import('./access-log/access-log.module').then(m => m.AccessLogModule),
                resolve: {
                    investedProfileRoutes: AccessLogStaffResolver,
                }
            },
            {
                path: ROUTER_CONST.config.admin.dashboard,
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                resolve: {
                    dashboard: DashBoardResolvers,
                }
            },
            {
                path: ROUTER_CONST.config.admin.role.root,
                loadChildren: () => import('./role-management/role-management.module').then(m => m.RoleManagementModule)
            },
            {
                path: ROUTER_CONST.config.admin.processConfig.root,
                loadChildren: () => import('./process-config/process-config.module').then(m => m.ProcessConfigModule),
            },
            {
                path: ROUTER_CONST.config.admin.customerAppConfig.root,
                loadChildren: () => import('./customer-app-config/customer-app-config.module').then(m => m.CustomerAppConfigModule),
            },
            {path: '**', redirectTo: ROUTER_CONST.config.admin.dashboard}
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class AdminRoutingModule {
}
